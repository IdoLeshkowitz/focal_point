function renderHiderBoardPage() {
    const jsxCode = `
        function Stam(){
            return <div></div>
        }
        function reducer(state, action){
            if (action.type === "setStep"){
                return {...state, currentStep: action.currentStep}
            }
            if (action.type === "setRoundNumber"){
                return {...state, currentRoundNumber: action.currentRoundNumber}
            }
            if (action.type === "setInstructionsNumber"){
                return {...state, currentInstructionsNumber: action.currentInstructionsNumber}
            }
            if (action.type === "setSelectionByRound"){
                const newSelectionByRound = {...state.selectionByRound}
                newSelectionByRound[action.roundNumber] = action.selection
                return {...state, selectionByRound: newSelectionByRound}
            }
            if (action.type === "setModal"){
                return {...state, modal: action.modal}
            }
            if (action.type === "closeModal"){
                return {...state, modal: null}
            }
            if (action.type === "finishInstructions"){
                return {...state, currentStep: "rounds"}
            }
            if (action.type === "finishRounds"){
                return {...state, currentStep: "feedback"}
            }
            return state
        }
        const initialState = {
            currentStep: "rounds",
            currentRoundNumber: null,
            currentInstructionsNumber: null,
            numberOfRounds: 3,
            multipliersByRound : {
                1: [1,1,1,1],
                2: [1,1,1,3],
                3: [1,2,3,4],
            },
            numberOfObjectsByRound : {
                1: 48,
                2: 40,
                3: 25,
            },
            selectionByRound : {
                1: [false,false,false,false],
                2: [false,false,false,false],
                3: [false,false,false,false],
            },
            steps : ["intro","rounds"],
            modal : null,
        }
        const DispatchContext = React.createContext(null)
        const StateContext = React.createContext(null)
        function HiderBoardPage(props){
            const [state, dispatch] = React.useReducer(reducer, initialState)
            const currentStep = React.useMemo(()=>state.currentStep, [state.currentStep])
            return (
                <DispatchContext.Provider value={dispatch}>
                    <StateContext.Provider value={state}>
                        <section>
                            {currentStep === "intro" && <Instructions/>}
                            {currentStep === "rounds" && <Rounds/>}
                            {currentStep === "feedback" && <Feedback/>}
                        </section>
                    </StateContext.Provider>
                </DispatchContext.Provider>
            )
        }
        function Feedback(props){
            return (
                <section>
                    <h4>Feedback</h4>
                    <p>
                        Does the situation remind you of anything in your life?<br/>
                        If it does, please describe. The five best stories will get a bonus. If it does not- ignore this question.
                    </p>
                    <textarea name="feedback" class="form-control" name="feedback" rows="5"></textarea>
                    <div class="button-container">
                        <button class="btn btn-primary" type="submit">Submit</button>
                    </div>
                </section>   
            )
        }
        function Rounds(props){
            const state = React.useContext(StateContext)
            const dispatch = React.useContext(DispatchContext)
            const currentRoundNumber = React.useMemo(()=>{
                if (!state.currentRoundNumber){
                    dispatch({type:"setRoundNumber", currentRoundNumber: 1})
                    return 1
                }
                return state.currentRoundNumber
            }, [state.currentRoundNumber])
            const currentSelection = React.useMemo(()=>{
                return state.selectionByRound[currentRoundNumber]
            }, [state.selectionByRound, currentRoundNumber])
            function onReset(){
                dispatch({type:"setDistributionByRound", roundNumber: currentRoundNumber, distribution: [0,0,0,0]})
                setProgress("distribution")
            }
            function finishRound(){
                const nextRoundNumber = currentRoundNumber + 1
                if (nextRoundNumber > state.numberOfRounds){
                    dispatch({type:"finishRounds"})
                }
                dispatch({type:"setRoundNumber", currentRoundNumber: nextRoundNumber})
            }
            function onBoxClick(boxIndex){
                const isSelected = currentSelection[boxIndex]
                const newSelection = [...currentSelection]
                newSelection[boxIndex] = !isSelected
                dispatch({type:"setSelectionByRound", roundNumber: currentRoundNumber, selection: newSelection})
            }
            const numberOfObjectsInStorage = React.useMemo(()=>{
                return state.numberOfObjectsByRound[currentRoundNumber]
            }, [state.numberOfObjectsByRound, currentRoundNumber])
            const storageClassName = () =>{
                let className = "storage"
                if (numberOfObjectsInStorage === 0){
                    className += " green"
                }
                return className
            }
            const boxesClassName = (boxIndex) =>{
                let className = "box question-mark seeker"
                const isSelected = currentSelection[boxIndex] === true
                if (isSelected){
                    className += " selected"
                }
                return className
            }
            const isReadyToProceed = React.useMemo(()=>{
                const numberOfSelectedBoxes = currentSelection.filter((isSelected)=>isSelected).length
                return numberOfSelectedBoxes === 2
            }, [currentSelection])
            return (
                <section>
                    <h4>Round {currentRoundNumber}</h4>
                    <div className="hider-board">
                        {/* storage */}
                        <div className={storageClassName()}>
                            {numberOfObjectsInStorage}
                        </div>
                        {/* boxes */}
                        <div className="boxes">
                            {
                                currentSelection.map((numberOfObjects, boxIndex)=>{
                                    return (
                                        <div className="box-container">
                                            <div className={boxesClassName(boxIndex)}/>
                                            <b>
                                                ×{state.multipliersByRound[currentRoundNumber][boxIndex]}
                                            </b>
                                            <input 
                                                type="checkbox"
                                                checked={currentSelection[boxIndex]}
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
        const ContentByRound = (roundNumber) => {
            const Instructions = {
                1 : (<p>
                        The game involves a number of boxes and a number of objects to be hidden in the boxes.<br/>
                        Each box has a value by which the number of objects in the box is multiplied (the boxes’ multiplication rate)...<br/>
                    </p>)
            }
            if (!roundNumber || !roundNumber in Instructions) return null
            return Instructions[roundNumber]
        }
        function Instructions(props){
            const state = React.useContext(StateContext)
            const dispatch = React.useContext(DispatchContext)
            const currentInstructionsNumber = React.useMemo(()=>state.currentInstructionsNumber, [state.currentInstructionsNumber])
            if (!currentInstructionsNumber) {
                dispatch({type:"setInstructionsNumber", currentInstructionsNumber: 1})
            }
            const content = React.useMemo(()=>ContentByRound(currentInstructionsNumber), [currentInstructionsNumber])
            function onButtonClick(){
                const nextInstructionsNumber = currentInstructionsNumber + 1
                if (!ContentByRound(nextInstructionsNumber)){
                    dispatch({type:"finishInstructions"})
                    return 
                }
                dispatch({type:"setInstructionsNumber", currentInstructionsNumber: nextInstructionsNumber})
            }
            return (
                <section>
                    <h4>Instructions</h4>
                    {content}
                    <div class="button-container">
                        <button class="btn btn-primary" onClick={onButtonClick}>Proceed</button>
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