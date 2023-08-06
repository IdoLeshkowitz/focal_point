function renderExitPage(){
    const jsxCode = `
        function Stam(){
            return <div></div>
        }
        function ExitPage(props){
           if (!props.userAcceptedTerms){
                return (
                    <p>
                    Please return your hit.
                    </p>
                )
            }
            if (props.endedSuccessfully){
                return (
                    <p>
                        You have successfully completed the study. Thank you for your participation.
                    </p>
                )
            } else {
                return (
                    <p>
                        Thank you for your participation in this study. Unfortunately, you did not complete the study successfully.    
                    </p>
                )
            }
        }
    `
    renderReactComponent(jsxCode, "react-root", "ExitPage", JSON.stringify(js_vars));
}

window.addEventListener("load", ()=>{
    renderExitPage()
})