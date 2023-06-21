const initialState = {
    array : []
}
export  const counterReducer = (state = initialState , action) =>{
    switch(action.type){
        case "Array" : 
        return{
            ...state , array : [...state.array , action.payload ]
        }
        default : 
        return state;
    }
}

export default counterReducer;