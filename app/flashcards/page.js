'use client'

import { useUser, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, updateDoc, setDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import { Card, CardActionArea, CardContent, Container, Grid, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, AppBar, Toolbar, Box } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [flashcardToDelete, setFlashcardToDelete] = useState(null);
    const [theme, setTheme] = useState('light');

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

    useEffect(() => {
        async function getFlashcards() {
            if (!user) {
                return;
            } else {
                const docRef = doc(collection(db, 'users'), user.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const collections = docSnap.data().flashcards || [];
                    setFlashcards(collections);
                } else {
                    await setDoc(docRef, { flashcards: [] });
                }
            }
        }
        getFlashcards();
    }, [user]);

    if (!isLoaded && !isSignedIn) {
        return <></>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    const handleClickOpen = (name) => {
        setFlashcardToDelete(name);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFlashcardToDelete(null);
    };

    const handleDelete = async (name) => {
        const userDocRef = doc(collection(db, 'users'), user.id);
        const flashcardCollectionRef = collection(userDocRef, name);
        const flashcardDocs = await getDocs(flashcardCollectionRef);

        const deletePromises = flashcardDocs.docs.map((flashcardDoc) => deleteDoc(flashcardDoc.ref));
        await Promise.all(deletePromises);

        const updatedFlashcards = flashcards.filter(flashcard => flashcard.name !== name);
        setFlashcards(updatedFlashcards);

        await updateDoc(userDocRef, {
            flashcards: updatedFlashcards,
        });
    };

    const handleHomeClick = () => {
        router.push('/');
    };

    // Define styles for light and dark modes
    const cardStyles = {
        light: {
            card: {
                backgroundColor: '#fff',
                color: '#000',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
            button: {
                color: '#000',
            },
            dialog: {
                backgroundColor: '#fff',
                color: '#000',
            }
        },
        dark: {
            card: {
                backgroundColor: '#333',
                color: '#fff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
            },
            button: {
                color: '#fff',
            },
            dialog: {
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
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h6">{flashcard.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                            <IconButton onClick={() => handleClickOpen(flashcard.name)} aria-label="delete" sx={cardStyles[theme].button}>
                                <DeleteIcon />
                            </IconButton>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={open}
                onClose={handleClose}
                sx={cardStyles[theme].dialog}
            >
                <DialogTitle sx={{ color: cardStyles[theme].dialog.color }}>Are you sure?</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: cardStyles[theme].dialog.color }}>Do you really want to delete this flashcard?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">
                        Cancel
                    </Button>
                    <Button 
                        onClick={async () => {
                            await handleDelete(flashcardToDelete);
                            handleClose();
                        }} 
                        color="primary"
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
