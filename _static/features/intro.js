function renderInstructionsPage(){
    const jsxCode = `
        function Stam(){
            return <div></div>
        }
        function InstructionsPage(props){
           return (
                <section>
                    <h4>Instructions</h4>
                    <p>
                        The game involves a set of boxes and a number of objects to be hidden in the boxes.<br/>
                        Each box has a value by which the number of objects in the box is multiplied (the box’ <b>multiplication rate</b>).<br/>
                        One player (the “Hider”) chooses how to distribute the objects across the boxes before a
                        second player (the “Opener”) chooses half of the boxes to open. Openers get the objects from
                        the boxes they chose to open (multiplied by each box’s multiplication rate), and Hiders get the
                        objects from each remaining box (multiplied by the box’s multiplication rate).
                    </p>
                    <p>
                        You will be assigned either the role of Hider or Opener and play the game three times with
                        different sets of boxes.
                    </p>
                    <div class="button-container">
                        <button class="btn btn-primary">Proceed</button>
                    </div>
                </section>
           )
        }
    `
    renderReactComponent(jsxCode, "react-root", "InstructionsPage", JSON.stringify(js_vars));
}

window.addEventListener("load", ()=>{
    renderInstructionsPage()
})