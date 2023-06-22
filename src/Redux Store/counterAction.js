//  todo : making the action store here, bascially function

const addElem = (obj) =>{
    return {
        type : "Array",
        payload : obj,
    }
}
const replace = (obj) =>{
    return {
        type : "Arrayreplace",
        payload : obj,
    }
}
const increment = () =>{
    return{
        type : "Adding"
    }
}
const decrement = () =>{
    return{
        type : "Substract"
    }
}
export  {addElem , increment , decrement , replace};