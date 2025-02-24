export interface User {
   _id: string;
   username: string;
   email: string;
   firstname: string;
   lastname: string;
   isAdmin: boolean;
 }
 
 export interface Exercise {
   _id: string;
   title: string;
   description: string;
   difficulty: 'easy' | 'medium' | 'hard';
 }
 
 export interface Info {
   _id: string;
   title: string;
   content: string;
   createdAt: Date;
 }