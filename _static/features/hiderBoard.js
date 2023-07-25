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
            if (action.type === "setDistributionByRound"){
                const roundNumber = action.roundNumber
                const distribution = action.distribution
                const newDistributionByRound = {...state.distributionByRound, [roundNumber]: distribution}
                return {...state, distributionByRound: newDistributionByRound}
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
            currentStep: "instructions",
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
            distributionByRound : {
                1 : [0,0,0,0],
                2 : [0,0,0,0],
                3 : [0,0,0,0],
            },
            steps : ["instructions","rounds"],
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
                            {currentStep === "instructions" && <Instructions/>}
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
            const [progress, setProgress] = React.useState("distribution")// distribution, results
            const [selectedBoxIndex, setSelectedBoxIndex] = React.useState(null)
            const [temporaryNumber, setTemporaryNumber] = React.useState(null)
            const state = React.useContext(StateContext)
            const dispatch = React.useContext(DispatchContext)
            const currentRoundNumber = React.useMemo(()=>{
                if (!state.currentRoundNumber){
                    dispatch({type:"setRoundNumber", currentRoundNumber: 1})
                    return 1
                }
                return state.currentRoundNumber
            }, [state.currentRoundNumber])
            const currentDistribution = React.useMemo(()=>state.distributionByRound[currentRoundNumber], [state.distributionByRound, currentRoundNumber])
            const numberOfObjectsInStorage = React.useMemo(()=> {
                const numberOfObjects = state.numberOfObjectsByRound[currentRoundNumber]
                const numberOfHiddenObjects = currentDistribution.reduce((a,b)=>a+b,0)
                return numberOfObjects - numberOfHiddenObjects
            }, [state.numberOfObjectsByRound, currentRoundNumber, currentDistribution])
            function onDistributionChange(numberOfObjects, boxIndex){
                const newDistribution = [...currentDistribution]
                newDistribution[boxIndex] = parseInt(numberOfObjects)
                const numberOfHiddenObjects = newDistribution.reduce((a,b)=>a+b,0)
                if (numberOfHiddenObjects > state.numberOfObjectsByRound[currentRoundNumber]){
                    dispatch({type:"setModal", modal: "tooManyObjects"})
                    return
                }
                dispatch({type:"setDistributionByRound", roundNumber: currentRoundNumber, distribution: newDistribution})
            }
            function onBoxBlur(boxIndex){
                if (isNaN(parseInt(temporaryNumber)) || parseInt(temporaryNumber) < 0){
                    setTemporaryNumber(null)
                }
                else {
                    onDistributionChange(temporaryNumber, boxIndex)
                }
                setSelectedBoxIndex(null)   
                setTemporaryNumber(null)
            }
            function onBoxChange(newValue){
                setTemporaryNumber(newValue)
            }
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
                setProgress("distribution")
            }
            if (progress === "results"){
                function calculateValue(numberOfObjects, multiplier){
                    return numberOfObjects * multiplier
                }
                return (
                    <section>
                        <h4>Round {currentRoundNumber}</h4>
                        <div className="hider-board">
                            {/* storage */}
                            <div className="storage">
                                0
                            </div>
                            {/* boxes */}
                            <div class="boxes">
                                {
                                    currentDistribution.map((numberOfObjects, boxIndex)=>{
                                        const value = calculateValue(numberOfObjects, state.multipliersByRound[currentRoundNumber][boxIndex])
                                        return (
                                            <div className="box-container">
                                                <span className="box">{value}</span>
                                                <span>×{state.multipliersByRound[currentRoundNumber][boxIndex]}</span>
                                            </div>
                                        )
                                    })               
                                }
                            </div>
                            <div class="footer">
                                <p>
                                    Above you can see the value of each box. The value is calculated by multiplying the number of objects in the box by the box’s multiplication rate.<br/>
                                    You can now proceed to the next round, or click back and hide again.
                                </p>
                                <div className="buttons">
                                    <button class="btn btn-primary" type="button" onClick={()=>onReset()}>Back</button>
                                    <button class="btn btn-primary" type="button" onClick={()=>finishRound()}>Proceed</button>
                                </div>
                            </div>
                        </div>
                    </section>
                )               
            }
            const storageClassName = () =>{
                let className = "storage"
                if (numberOfObjectsInStorage === 0){
                    className += " green"
                }
                return className
            }
            return (
                <section>
                    <h4>Round {currentRoundNumber}</h4>
                    <div className="hider-board">
                        {/* storage */}
                        <div className={storageClassName()}>
                            {numberOfObjectsInStorage}
                        </div>
                        {/* boxes */}
                        <div class="boxes">
                            {
                                currentDistribution.map((numberOfObjects, boxIndex)=>{
                                    return (
                                        <div className="box-container">
                                            <input 
                                                type="number" 
                                                className="box" 
                                                value={selectedBoxIndex === boxIndex ? temporaryNumber : numberOfObjects}
                                                onFocus={()=>{
                                                    if (progress !== "distribution") return
                                                    setSelectedBoxIndex(boxIndex)
                                                }}
                                                onBlur={()=>onBoxBlur(boxIndex)} 
                                                onChange={(e)=>onBoxChange(e.target.value)}
                                                />
                                             <span>
                                                ×{state.multipliersByRound[currentRoundNumber][boxIndex]}
                                            </span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div class="footer">
                        {
                            numberOfObjectsInStorage === 0 &&
                                <div className="buttons">
                                    <button class="btn btn-primary" type="button" onClick={()=>setProgress("results")}>Done</button>
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