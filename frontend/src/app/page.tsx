// app/page.js

import { redirect } from 'next/navigation';

export default function RootPage() {
    // Odmah preusmerava sve posetioce koji dođu na putanju '/'
    redirect('/home');
    
    // Možete ostaviti i 'return null;' ili nešto slično, ali redirect prekida izvršenje
    // return null; 
}