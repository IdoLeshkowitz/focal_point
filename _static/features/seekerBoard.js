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
                        <div className="board-row background-dark-grey">
                            <div className="info background-light-grey">
                                <p>
                                    Another player distributed {state.totalNumberOfObjects} objects into some or all the boxes.
                                </p>
                            </div>
                            {/* storage */}
                            <div className={storageClassName()}>
                                <h4>
                                    {state.totalNumberOfObjects}
                                </h4>
                                <span style={{alignSelf:"center"}}>
                                    Objects left to hide
                                </span>
                            </div>
                            <div className="boxes-area">
                                <div className="boxes">
                                    {
                                        state.selection.map((_,boxIndex)=>{
                                            return (
                                                <div className="box-container">
                                                    <div className="box box-open hider">
                                                        <span className="text-black">?</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="board-row background-dark-grey">
                            <div className="info background-light-grey">
                                The objects have multiplied in the boxes
                            </div>
                            <div className="boxes">
                                {
                                    state.selection.map((_, boxIndex)=>{
                                        return (
                                            <div className="box-container">
                                                <span className="arrow-down">
                                                    ×{state.multipliers[boxIndex]}
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="board-row background-yellow">
                            <div className="info">
                                <p>
                                    <u>Your Task:</u><br/>
                                    Choose 2 boxes to take.
                                </p>
                            </div>
                            <div className="boxes">
                            {
                                state.selection.map((isSelected, boxIndex)=>{
                                    return (
                                        <div className="box-container" >
                                            <div className="box-closed box" >
                                                <span className="text-white">?</span>
                                            </div>
                                                <input
                                                    type="checkbox" 
                                                    value ={isSelected}
                                                    onChange={()=>{onBoxClick(boxIndex)}}
                                                    />
                                        </div>
                                    )
                                })
                            }
                            </div>
                        </div>
                        <div className="footer">
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