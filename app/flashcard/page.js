'use client'

import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams, useRouter } from "next/navigation"
import { Container, Grid, Card, CardActionArea, CardContent, Typography, Box, AppBar, Toolbar, Button, IconButton } from "@mui/material"
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [theme, setTheme] = useState('light');
    const searchParams = useSearchParams()
    const search = searchParams.get('id')
    const router = useRouter()

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) {
                return
            } else {
                const colRef = collection(doc(collection(db, 'users'), user.id), search)
                const docs = await getDocs(colRef)
                const flashcards = []

                docs.forEach((doc) => {
                    flashcards.push({ id: doc.id, ...doc.data() })
                })
                setFlashcards(flashcards)
            }
        }
        getFlashcard()
    }, [user, search])

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.body.className = savedTheme;
    }, []);

    const handleThemeToggle = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.className = newTheme;
        localStorage.setItem('theme', newTheme);
    };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleHomeClick = () => {
        router.push('/')
    }

    if (!isLoaded && !isSignedIn) {
        return <></>
    }

    // Define styles for light and dark modes
    const cardStyles = {
        light: {
            card: {
                backgroundColor: '#fff',
                color: '#000',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
            flipCard: {
                backgroundColor: '#f5f5f5',
                color: '#000',
            }
        },
        dark: {
            card: {
                backgroundColor: '#333',
                color: '#fff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
            },
            flipCard: {
                backgroundColor: '#444',
                color: '#fff',
            }
        }
    };

    return (
        <Container maxWidth="100vw">
            <AppBar position="static" sx={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16, overflow: 'hidden' }}>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }} onClick={handleHomeClick} sx={{ cursor: 'pointer' }}>
                        Flashcard SaaS
                    </Typography>
                    <IconButton onClick={handleThemeToggle} color="inherit">
                        {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                    </IconButton>
                    <Button color="inherit" onClick={handleHomeClick}>Home</Button>
                    <SignedIn>
                        <UserButton sx={{ ml: 2 }} />
                    </SignedIn>
                    <SignedOut>
                        <Button color="inherit" href="/sign-in">Login</Button>
                        <Button color="inherit" href="/sign-up">Create Account</Button>
                    </SignedOut>
                </Toolbar>
            </AppBar>

            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={cardStyles[theme].card}>
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
                                            backgroundColor: cardStyles[theme].flipCard.backgroundColor,
                                            color: cardStyles[theme].flipCard.color,
                                        },
                                        '& > div > div:nth-of-type(2)': {
                                            transform: 'rotateY(180deg)',
                                        },
                                    }}>
                                        <div>
                                            <div>
                                                <Typography variant="h5" component="div">
                                                    {flashcard.front}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="h5" component="div">
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
        </Container>
    )
}