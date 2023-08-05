function renderHiderBoardPage() {
    const jsxCode = `
        function Stam(){
            return <div></div>
        }
        function reducer(state, action){
            if (action.type === "setSelection"){
                const index = action.index
                const isSelected = action.isSelected
                const newSelection = [...state.selection]
                newSelection[index] = isSelected
                return {...state, selection: newSelection}
            }
            if (action.type === "setModal"){
                return {...state, modal: action.modal}
            }
            if (action.type === "closeModal"){
                return {...state, modal: null}
            }
            if (action.type === "finishRounds"){
                return {...state, currentStep: "feedback"}
            }
            return state
        }
        const initialState = {
            multipliers: js_vars.multipliers,
            totalNumberOfObjects: js_vars.totalNumberOfObjects,
            selection : [false, false, false, false],
            modal : null,
        }
        const DispatchContext = React.createContext(null)
        const StateContext = React.createContext(null)
        function HiderBoardPage(props){
            const [state, dispatch] = React.useReducer(reducer, initialState)
            return (
                <DispatchContext.Provider value={dispatch}>
                    <StateContext.Provider value={state}>
                        <section>
                            <Rounds {...props}/>
                        </section>
                    </StateContext.Provider>
                </DispatchContext.Provider>
            )
        }
        function Rounds(props){
            const state = React.useContext(StateContext)
            const dispatch = React.useContext(DispatchContext)
            function onReset(){
                dispatch({type:"setSelection", selection: [false, false, false, false]})
            }
            function finishRound(){
                liveSend({
                    'action': 'set_selection',
                    'selection': state.selection,
                })
                document.querySelector("form").submit()
            }
            function onBoxClick(boxIndex){
                const isAlreadySelected = state.selection[boxIndex] === true
                let isSelected = true
                if (isAlreadySelected){
                    isSelected = false
                }
                dispatch({type:"setSelection", index: boxIndex, isSelected})
            }
            const storageClassName = () =>{
                let className = "storage"
                return className
            }
            const boxesClassName = (boxIndex) =>{
                let className = "box question-mark seeker"
                const isSelected = state.selection[boxIndex] === true
                if (isSelected){
                    className += " selected"
                }
                return className
            }
            const isReadyToProceed = React.useMemo(()=>{
                const numberOfSelectedBoxes = state.selection.filter((isSelected)=>isSelected).length
                return numberOfSelectedBoxes === 2
            }, [state.selection])
            return (
                <section>
                    <h4>Round {props.roundNumber}</h4>
                    <div className="hider-board">
                        {/* storage */}
                        <div className={storageClassName()}>
                            {state.totalNumberOfObjects}
                        </div>
                        {/* boxes */}
                        <div className="boxes">
                            {
                                state.selection.map((_, boxIndex)=>{
                                    return (
                                        <div className="box-container">
                                            <div className={boxesClassName(boxIndex)}/>
                                            <b>
                                                ×{state.multipliers[boxIndex]}
                                            </b>
                                            <input 
                                                type="checkbox"
                                                checked={state.selection[boxIndex]}
                                                onChange={()=>{onBoxClick(boxIndex)}}
                                                />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div class="footer">
                        {
                            isReadyToProceed &&
                                <div className="buttons">
                                    <button class="btn btn-primary" type="button" onClick={finishRound}>Done</button>
                                </div>
                        }
                        </div>
                    </div>
                </section>
            )
        }
    `
    renderReactComponent(jsxCode, "react-root", "HiderBoardPage", JSON.stringify(js_vars));
}

window.addEventListener("load", () => {
    renderHiderBoardPage()
})