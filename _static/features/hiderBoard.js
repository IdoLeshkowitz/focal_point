function renderHiderBoardPage() {
    const jsxCode = `
        function Stam(){
            return <div></div>
        }
        function reducer(state, action){
            if (action.type === "setDistribution"){
                const distribution = action.distribution
                return {...state, distribution}
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
            distribution : [0,0,0,0],
            modal : null,
        }
        const DispatchContext = React.createContext(null)
        const StateContext = React.createContext(null)
        const JsVarsContext = React.createContext(null)
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
            const [progress, setProgress] = React.useState("distribution")// distribution, results
            const [selectedBoxIndex, setSelectedBoxIndex] = React.useState(null)
            const [temporaryNumber, setTemporaryNumber] = React.useState(null)
            const state = React.useContext(StateContext)
            const dispatch = React.useContext(DispatchContext)
            const currentDistribution = React.useMemo(()=>state.distribution, [state.distribution])
            const numberOfObjectsInStorage = React.useMemo(()=> {
                const totalNumberOfObjects = state.totalNumberOfObjects
                const numberOfHiddenObjects = currentDistribution.reduce((a,b)=>a+b,0)
                return totalNumberOfObjects - numberOfHiddenObjects
            }, [state.numberOfObjectsByRound, currentDistribution])
            function onDistributionChange(numberOfObjects, boxIndex){
                const newDistribution = [...currentDistribution]
                newDistribution[boxIndex] = numberOfObjects
                const numberOfHiddenObjects = newDistribution.reduce((a,b)=>a+b,0)
                if (numberOfHiddenObjects > state.totalNumberOfObjects){
                    return
                }
                dispatch({type:"setDistribution", distribution: newDistribution})
            }
            function onBoxBlur(boxIndex){
                if (isNaN(parseInt(temporaryNumber)) || parseInt(temporaryNumber) < 0){
                    setTemporaryNumber(null)
                }
                else {
                    onDistributionChange(parseInt(temporaryNumber), boxIndex)
                }
                setSelectedBoxIndex(null)   
                setTemporaryNumber(null)
            }
            function onBoxChange(newValue){
                setTemporaryNumber(newValue)
            }
            function onReset(){
                dispatch({type:"setDistribution", distribution: [0,0,0,0]})
                setProgress("distribution")
            }
            function onDone(){
                if (progress === "distribution"){
                    setProgress("results")   
                }else {
                    finishRound()
                }
            }
            function finishRound(){
                for (let i=0; i<state.distribution.length; i++){
                    liveSend({
                        action: "set_number_of_objects",
                        box_index : i,
                        number_of_objects : state.distribution[i],
                    })
                }
                document.querySelector("form").submit()
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
                    <h4>Round {props.roundNumber}</h4>
                    <div className="hider-board">
                        <div className="board-row background-yellow">
                            <div className="info">
                                <p>
                                    <u>Your Task:</u><br/>
                                    You need to hide {numberOfObjectsInStorage} objects in some or all the boxes.
                                </p>
                            </div>
                            <div className={storageClassName()}>
                                <h4>
                                    {numberOfObjectsInStorage}
                                </h4>
                                <span style={{alignSelf:"center"}}>
                                    Objects left to hide
                                </span>
                            </div>
                            {/* boxes */}
                            <div className="boxes-area">
                                { progress === "distribution" &&
                                    <>
                                        <div className="boxes">
                                            {
                                                currentDistribution.map((numberOfObjects, boxIndex)=>{
                                                    return (
                                                        <div className="box-container">
                                                            <div className="box box-open hider">
                                                                <input 
                                                                    type="number"  
                                                                    value={selectedBoxIndex === boxIndex ? temporaryNumber : numberOfObjects.toString()}
                                                                    onFocus={()=>{
                                                                        if (progress !== "distribution") return
                                                                        setSelectedBoxIndex(boxIndex)
                                                                    }}
                                                                    onBlur={()=>onBoxBlur(boxIndex)} 
                                                                    onChange={(e)=>onBoxChange(e.target.value)}
                                                                    onKeyDown={(e)=>{
                                                                        if (e.key === "Enter"){
                                                                            onBoxBlur(boxIndex)
                                                                            e.target.blur()
                                                                        }
                                                                    }}
                                                                    />
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </>
                                }
                            </div>
                        </div>
                        <div className="board-row background-dark-grey">
                            <div className="info background-light-grey">
                                The objects will multiply in the boxes
                            </div>
                            <div className="boxes">
                                { 
                                    currentDistribution.map((_,boxIndex)=>{
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
                        <div className="board-row background-dark-grey">
                            <div className="info background-light-grey">
                                Another player will choose 2 boxes to “steal”. They will only know the boxes’ multiplier rates.
                            </div>
                            <div className="boxes">
                                {
                                    currentDistribution.map((numberOfObjects, boxIndex)=>{
                                        const value = numberOfObjects * state.multipliers[boxIndex]
                                        return (
                                            <div className="box-container">
                                                <div className="box-closed box" style={{userSelect:'none'}}><span>{value}</span></div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                            <div className="footer">
                                {
                                    progress === "results" &&
                                        <p>
                                            Above you can see the value of each box. The value is calculated by multiplying the number of objects in the box by the box’s multiplication rate.<br/>
                                            You can now proceed to the next round, or click back and hide again.
                                        </p>
                                }
                                {
                                    numberOfObjectsInStorage === 0 &&
                                        <div className="buttons">
                                            { progress === "results" &&
                                                <button className="btn btn-primary" type="button" onClick={onReset}>Back</button>
                                            }
                                            <button className="btn btn-primary" type="button" onClick={onDone}>Done</button>
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