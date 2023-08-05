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
                newDistribution[boxIndex] = parseInt(numberOfObjects)
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
                    onDistributionChange(temporaryNumber, boxIndex)
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
            if (progress === "results"){
                function calculateValue(numberOfObjects, multiplier){
                    return numberOfObjects * multiplier
                }
                return (
                    <section>
                        <h4>Round {props.roundNumber}</h4>
                        <div className="hider-board">
                            {/* storage */}
                            <div className="storage">
                                0
                            </div>
                            {/* boxes */}
                            <div className="boxes">
                                {
                                    currentDistribution.map((numberOfObjects, boxIndex)=>{
                                        const value = calculateValue(numberOfObjects, state.multipliers[boxIndex])
                                        return (
                                            <div className="box-container">
                                                <span className="box-full">{value}</span>                                                
                                            </div>
                                        )
                                    })               
                                }
                            </div>
                            <div className="footer">
                                <p>
                                    Above you can see the value of each box. The value is calculated by multiplying the number of objects in the box by the box’s multiplication rate.<br/>
                                    You can now proceed to the next round, or click back and hide again.
                                </p>
                                <div className="buttons">
                                    <button className="btn btn-primary" type="button" onClick={()=>onReset()}>Back</button>
                                    <button className="btn btn-primary" type="button" onClick={()=>finishRound()}>Proceed</button>
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
                    <h4>Round {props.roundNumber}</h4>
                    <div className="hider-board">
                        {/* storage */}
                        <div className="storage-area">
                            <div className={storageClassName()}>
                                {numberOfObjectsInStorage}
                            </div>
                            <span style={{alignSelf:"center"}}>
                            Objects left to hide
                            </span>
                        </div>
                        {/* boxes */}
                        <div className="boxes-area">
                            <div className="boxes">
                                {
                                    currentDistribution.map((numberOfObjects, boxIndex)=>{
                                        return (
                                            <div className="box-container">
                                                <input 
                                                    type="number" 
                                                    className="box hider" 
                                                    value={selectedBoxIndex === boxIndex ? temporaryNumber : numberOfObjects}
                                                    onFocus={()=>{
                                                        if (progress !== "distribution") return
                                                        setSelectedBoxIndex(boxIndex)
                                                    }}
                                                    onBlur={()=>onBoxBlur(boxIndex)} 
                                                    onChange={(e)=>onBoxChange(e.target.value)}
                                                    />
                                                 <span>
                                                    ×{state.multipliers[boxIndex]}
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="boxes">
                                { 
                                    currentDistribution.map((_)=>{
                                        return (
                                            <div className="box-container">
                                                <span style={{fontWeight:"bold", fontSize:"2.5rem", color:"#ed7d31"}}>
                                                    ↓
                                                </span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="boxes">
                                {
                                    currentDistribution.map((numberOfObjects, boxIndex)=>{
                                        const value = numberOfObjects * state.multipliers[boxIndex]
                                        return (
                                            <div className="box-container">
                                                <span className="box-full" style={{userSelect:'none'}}>{value}</span>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="footer">
                        {
                            numberOfObjectsInStorage === 0 &&
                                <div className="buttons">
                                    <button className="btn btn-primary" type="button" onClick={()=>setProgress("results")}>Done</button>
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