export interface Post {
    _id: string;
    title: string;
    content: string;
    imagePath: string | FormData  | File;
    creator: string;
}