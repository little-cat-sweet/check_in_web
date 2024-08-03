// import { makeAutoObservable } from 'mobx'
// import {nanoid} from 'nanoid'
// class BookStore {
//
//     books = [
//         {id : "1", name: "Jack"},
//         {id : "2", name: "Mary"},
//         {id : "3", name: "John"}
//     ]
//     constructor() {
//         makeAutoObservable(this)
//     }
//
//     addBook(e, name){
//         let book = {id : nanoid(), name : name}
//         console.log("add the book")
//         console.log(e)
//         console.log("name : " + name)
//         console.log("book : ", book)
//         this.books.push(book)
//     }
// }
// const book = new BookStore()
//
// export default book;