import {makeAutoObservable} from 'mobx'
import {nanoid} from 'nanoid'

class BookStore {

    books = [
        {key: 1, id: "1", name: "Jack"},
        {key: 2, id: "2", name: "Mary"},
        {key: 3, id: "3", name: "John"}
    ]

    constructor() {
        makeAutoObservable(this)
    }

    addBook(e, name) {
        let book = {id: nanoid(), name: name}
        console.log("add the book")
        console.log(e)
        console.log("name : " + name)
        console.log("book : ", book)
        this.books.push(book)
    }
}

const book = new BookStore()

export default book;