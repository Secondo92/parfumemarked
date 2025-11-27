// src/utils/chat.js

import { getDB, getCurrentUserId } from '../services/firebase.js';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc, 
    doc, 
    serverTimestamp,
    onSnapshot,
    orderBy 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


/**
 * Henter stien til den offentlige samtale-kollektion.
 * Samtaler gemmes som offentlige data, da de involverer to parter.
 * @returns {string} Firestore sti.
 */
export function getConversationCollectionPath() {
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    return `artifacts/${appId}/public/data/conversations`;
}

/**
 * Henter alle samtaler for den aktuelle bruger.
 * Samtalerne er dem, hvor brugerens ID er inkluderet i 'participants' arrayet.
 * @param {Function} callback - Kaldes med et array af samtaler i realtid.
 * @returns {Function} Unsubscribe funktion til at stoppe lytteren.
 */
export function listenForConversations(callback) {
    const db = getDB();
    const userId = getCurrentUserId();

    if (!db || !userId) {
        console.warn("Firestore eller bruger-ID er ikke tilgængeligt.");
        return () => {}; // Returnerer en tom unsubscribe funktion
    }

    const convRef = collection(db, getConversationCollectionPath());
    
    // Query: Hent samtaler, hvor brugerens ID er i 'participants' arrayet.
    const q = query(convRef, 
        where("participants", "array-contains", userId),
        orderBy("lastUpdated", "desc") // Sorter efter seneste aktivitet
    );

    // Opret en realtidslytter
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const conversations = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(conversations);
    }, (error) => {
        console.error("Fejl i realtidslytter for samtaler:", error);
    });

    return unsubscribe;
}

/**
 * Henter beskeder for en specifik samtale.
 * @param {string} conversationId - ID'et på samtalen.
 * @param {Function} callback - Kaldes med et array af beskeder i realtid.
 * @returns {Function} Unsubscribe funktion til at stoppe lytteren.
 */
export function listenForMessages(conversationId, callback) {
    const db = getDB();
    if (!db || !conversationId) return () => {};

    // Beskeder gemmes i en underkollektion af samtalen: conversations/{id}/messages
    const messagesRef = collection(db, getConversationCollectionPath(), conversationId, "messages");
    
    // Query: Hent beskeder og sorter efter timestamp.
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(messages);
    }, (error) => {
        console.error("Fejl i realtidslytter for beskeder:", error);
    });

    return unsubscribe;
}

/**
 * Sender en ny besked i en samtale.
 * @param {string} conversationId 
 * @param {string} text - Beskedens indhold.
 * @param {string} senderId 
 */
export async function sendMessage(conversationId, text, senderId) {
    const db = getDB();
    if (!db || !conversationId || !text || !senderId) return;

    try {
        // 1. Tilføj beskeden til underkollektionen
        const messagesRef = collection(db, getConversationCollectionPath(), conversationId, "messages");
        await addDoc(messagesRef, {
            text: text,
            senderId: senderId,
            timestamp: serverTimestamp() 
        });

        // 2. Opdater hovedsamtale-dokumentet med seneste aktivitet (vigtigt for sortering)
        const convDocRef = doc(db, getConversationCollectionPath(), conversationId);
        await setDoc(convDocRef, {
            lastMessage: text,
            lastUpdated: serverTimestamp()
        }, { merge: true }); // Merge: Bevarer andre felter som participants

    } catch (error) {
        console.error("Fejl ved afsendelse af besked:", error);
    }
}