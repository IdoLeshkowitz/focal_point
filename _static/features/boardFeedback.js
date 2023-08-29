function renderBoardFeedbackPage() {
    const jsxCode = `
        function Stam(){
            return <div></div>
        }
        function FeedbackPage(props){
            return (
               <section>
                    <h4>(Optional) One final question</h4>
                    <p>
                        Thinking about this game, what real-life situations, if any, does it resemble? Please describe. The top five responses will receive a bonus.
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