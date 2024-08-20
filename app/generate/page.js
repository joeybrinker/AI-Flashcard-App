'use client'

import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { db } from "@/firebase" 
import { Container, Typography, Box, Paper, TextField, Button, Grid, Card, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, AppBar, Toolbar, IconButton } from "@mui/material"
import { writeBatch, doc, collection, getDoc, setDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const [theme, setTheme] = useState('light')
    const router = useRouter()

    // Retrieve and apply the theme from localStorage when the page loads
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light'
        setTheme(savedTheme)
        document.body.className = savedTheme
    }, [])

    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.body.className = newTheme
        localStorage.setItem('theme', newTheme)
    }

    const handleSubmit = async () => {
        fetch('/api/generate', {
            method: 'POST',
            body: text,  
        })
        .then((res) => res.json())
        .then(data => setFlashcards(data))
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if(!name){
            alert('Please enter a name for your flashcards')
            return
        }

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user.id)
        const docSnap = await getDoc(userDocRef)

        if(docSnap.exists()){
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)){
                alert("You already have a collection with that name")
                return
            }
            else{
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else{
            batch.set(userDocRef, {flashcards: [{name}]})
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    const handleHomeClick = () => {
        router.push('/')
    }

    

    return (
        <Container maxWidth="md">
            <AppBar position="static" sx={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16, overflow: 'hidden' }}>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }} onClick={handleHomeClick} sx={{ cursor: 'pointer' }}>
                        Flashcard Saas
                    </Typography>
                    <Button color="inherit" onClick={handleHomeClick}>Home</Button>
                    <IconButton onClick={handleThemeToggle} color="inherit">
                        {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                    </IconButton>
                    <SignedIn>
                        <UserButton sx={{ ml: 2 }} />
                    </SignedIn>
                    <SignedOut>
                        <Button color="inherit" href="/sign-in">Login</Button>
                        <Button color="inherit" href="/sign-up">Create Account</Button>
                    </SignedOut>
                </Toolbar>
            </AppBar>

            <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4">Generate Flashcards</Typography>
                <Paper sx={{ p: 4, width: '100%' }}>
                    <TextField 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        label="Enter text" 
                        fullWidth 
                        multiline 
                        rows={4} 
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
                        Generate
                    </Button>
                </Paper>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5">Flashcards</Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}> 
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box sx={{
                                                perspective: '1000px',
                                                '& > div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '200px',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                },
                                                '& > div > div': {
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                },
                                                '& > div > div: nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)',
                                                },
                                            }}>
                                                <div>
                                                    <div>
                                                        <Typography variant="h5">
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h5">
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant="contained" color="primary" sx={{ mt: 2, mb: 2 }} onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a name for your flashcards
                    </DialogContentText>
                    <TextField 
                        autoFocus 
                        margin="dense" 
                        label="Collection Name" 
                        type="text" 
                        fullWidth 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

