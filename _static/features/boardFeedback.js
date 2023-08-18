function renderBoardFeedbackPage() {
    const jsxCode = `
        function Stam(){
            return <div></div>
        }
        function FeedbackPage(props){
            return (
               <section>
                    <h4>A Question</h4>
                    <p>
                        Does the situation remind you of anything in your life?<br/>
                        If it does, please describe. The five best stories will get a bonus. If it does not- ignore this question.
                    </p>
                    <textarea name="feedback" className="form-control" id="feedback" rows="5"></textarea>
                    <div className="button-container">
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </div>
               </section> 
           )
        }
    `
    renderReactComponent(jsxCode, "react-root", "FeedbackPage", JSON.stringify(js_vars));
}

window.addEventListener("load", () => {
    renderBoardFeedbackPage()
})