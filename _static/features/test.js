function renderTestPage() {
    const jsxCode = `
        function Stam(){
            return <div></div>
        }
        const steps = [
            <Instructions/>,
            <Question 
                label={<span>If the Hider puts all objects in B2 and the Opener opens box B4 how much will they get –</span>}
                id="question_1"
                expectedHiderAnswer="12"
                expectedOpenerAnswer="0"
                />,
            <Question
                label={<span>If the Hider puts 2 objects in B2 and 4 objects in B4 and the Opener opens box B4 how much will they get –</span>}
                id="question_2"
                expectedHiderAnswer="4"
                expectedOpenerAnswer="16"
                />,
            <Question
                label={<span>If the Hider puts, again, 2 objects in B2 and 4 objects in B4 and the Opener opens box B2 how much will they get –</span>}
                id="question_3"
                expectedHiderAnswer="16"
                expectedOpenerAnswer="4"
                />,    
            <EndTest/>                            
        ]
        function reducer(state, action){
            if (action.type === "submitQuestion"){
                const currentStep = steps[state.currentStepIndex]
                const expectedHiderAnswer = currentStep.props.expectedHiderAnswer
                const expectedOpenerAnswer = currentStep.props.expectedOpenerAnswer
                const hiderAnswer = state.hiderAnswer.value
                const openerAnswer = state.openerAnswer.value
                const hiderAnswerIsCorrect = hiderAnswer === expectedHiderAnswer
                const openerAnswerIsCorrect = openerAnswer === expectedOpenerAnswer
                const nextStep = steps[state.currentStepIndex + 1]
                const isLastStep = nextStep.type.name === "EndTest" 
                liveSend({
                    action: "submit_question",
                    question_id: currentStep.props.id,
                    hider_answer: hiderAnswer,
                    opener_answer: openerAnswer,
                    hider_answer_is_correct: hiderAnswerIsCorrect,
                    opener_answer_is_correct: openerAnswerIsCorrect,
                    mistakes_count: state.mistakesCount,
                })
                if (!hiderAnswerIsCorrect || !openerAnswerIsCorrect){
                    if (state.mistakesCount === 0){
                        return {...state, mistakesCount: 1}
                    }
                    return {...state, endedSuccessfully: false, currentStepIndex : steps.length - 1}
                }
                if (isLastStep){
                    return {...state, endedSuccessfully: true, currentStepIndex : steps.length - 1}
                }
                return {...state, mistakesCount: 0, currentStepIndex: state.currentStepIndex + 1, hiderAnswer: {value: "", state: 'unanswered'}, openerAnswer: {value: "", state: 'unanswered'}} 
            }
            if (action.type === "setHiderAnswer"){
                return {...state, hiderAnswer: action.hiderAnswer}
            }
            if (action.type === "setOpenerAnswer"){
                return {...state, openerAnswer: action.openerAnswer}
            }
            if (action.type === "proceed"){
                return {...state, currentStepIndex: state.currentStepIndex + 1}
            }
            if (action.type === "setHiderAnswer"){
                return {...state, hiderAnswer: action.hiderAnswer}
            }
            if (action.type === "setOpenerAnswer"){
                return {...state, openerAnswer: action.openerAnswer}
            }
            if (action.type === "incrementMistakesCount"){
                return {...state, mistakesCount: state.mistakesCount + 1}
            }
            if (action.type === "resetMistakesCount"){
                return {...state, mistakesCount: 0}
            }
            return state
        }
        const DispatchContext = React.createContext(null)
        const StateContext = React.createContext(null)
        function TestPage(props){
           const [state, dispatch] = React.useReducer(reducer, {
               currentStepIndex : props.currentStepIndex ?? 0,
                hiderAnswer: {
                    value: "",
                    state: 'unanswered'
                },
                openerAnswer: {
                    value: "",
                    state: 'unanswered'
                },
                mistakesCount: props.mistakesCount ?? 0,
                endedSuccessfully: null
           } )
           const currentStep = React.useMemo(()=>steps[state.currentStepIndex], [state.currentStepIndex])
           function onButtonClick(){
               const currentStepType = currentStep.type.name
               if (state.endedSuccessfully !== null){
                     return document.querySelector("form").submit()
               }
               if (currentStepType === "Instructions"){
                     dispatch({type:"proceed"})
               }
               if (currentStepType === "Question"){
                    dispatch({type:"submitQuestion"})
               }
           }
           function isInputValid(){
                if (currentStep.type.name === "Instructions"){
                    return true
                }
               return state.hiderAnswer.state === "valid" && state.openerAnswer.state === "valid"
           }
           return (
                <DispatchContext.Provider value={dispatch}>
                    <StateContext.Provider value={state}>
                        <input type="hidden" name="ended_successfully" value={state.endedSuccessfully ?? false} />
                        <section>
                            <h4>Test</h4>
                            {currentStep}
                            <div class="button-container">       
                                <button class="btn btn-primary" type="button" onClick={onButtonClick} disabled={!isInputValid()}>
                                    { state.endedSuccessfully === false ?
                                        "Exit"
                                        :
                                        "Proceed"
                                    }
                                </button>
                            </div>
                        </section>
                    </StateContext.Provider>
                </DispatchContext.Provider>
           )
        }
        function Instructions(){
            return ( 
                <p>
                    Before you do let us make sure that you understand the game.<br/>
                    Consider two boxes; box B2 multiplies its objects by 2; box B4 multiplies its objects by 4.<br/>
                    The hider has 6 objects to hide.
                </p>
            )
        }
        function Question(props){
            const dispatch = React.useContext(DispatchContext)
            const state = React.useContext(StateContext)
            function validateNumberInput(input){
                /* check that the input is a valid round number */
                if (input === ""){
                    return false
                }
                const parsedInput = parseInt(input)
                if (isNaN(parsedInput)){
                    return false
                }
                if (parsedInput !== parseFloat(input)){
                    return false
                }
                if (parsedInput < 0){
                    return false
                }
                return true
            }
            function onHiderAnswerChange(newAnswer){
                const isValid = validateNumberInput(newAnswer)
                if (isValid){
                    dispatch({type:"setHiderAnswer", hiderAnswer: {value: newAnswer, state: "valid"}})
                } else {
                    dispatch({type:"setHiderAnswer", hiderAnswer: {value: newAnswer, state: "error"}})
                }
            }
            function onOpenerAnswerChange(newAnswer){
                const isValid = validateNumberInput(newAnswer)
                if (isValid){
                    dispatch({type:"setOpenerAnswer", openerAnswer: {value: newAnswer, state: "valid"}})
                } else {
                    dispatch({type:"setOpenerAnswer", openerAnswer: {value: newAnswer, state: "error"}})
                }
            }
            function inputClassName(answerState){
                let output = "underline-input"
                if (answerState === "error"){
                    output += " error"
                }
                return output
            }
            return (
                <>
                    <p>
                        {props.label}<br/>
                        The Hider<input type="number" value={state.hiderAnswer.value} onChange={(e)=>onHiderAnswerChange(e.target.value)} className={inputClassName(state.hiderAnswer.state)}/> The Opener<input type="number" value={state.openerAnswer.value} onChange={(e)=>onOpenerAnswerChange(e.target.value)} className={inputClassName(state.openerAnswer.state)}/>
                    </p>
                    { state.mistakesCount === 1 && 
                        <p className="error">
                            <span>Incorrect answer. You have 1 more attempt.</span>
                        </p>
                    }
                </>
            )
        }
        function EndTest(props){
            const state = React.useContext(StateContext)
            if (state.endedSuccessfully === true){
                return (
                    <p>
                        You have completed the test successfully. Please proceed to the next page.
                    </p>
                )
            }
            if (state.endedSuccessfully === false){
                return (
                    <p>
                        Since you exceeded the amount of accepted attempts you are asked to exit the experiment.
                    </p>
                )
            }
                
        }
    `
    renderReactComponent(jsxCode, "react-root", "TestPage", JSON.stringify(js_vars));
}

window.addEventListener("load", () => {
    renderTestPage()
})