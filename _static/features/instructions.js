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
                        The game involves a number of boxes and a number of objects to be hidden in the boxes.<br/>
                        Each box has a value by which the number of objects in the box is multiplied (the boxes’ multiplication rate).<br/>
                        A Hider hides a pack of objects in the boxes and an Opener is entitled to open half of the boxes.<br/>
                        Both Hider and Opener know the multiplication rate of each box.<br/>
                        Here is in more detail:
                    </p>
                    { props.role === "seeker" && 
                        <p>
                            A Hider hid objects in four boxes. Importantly, in some of the boxes the objects multiply.<br/>
                            You are an <b>Opener</b>, allowed to grab/snatch two of those boxes. Whatever you find in these
                            boxes you get; the Hider will get whatever remains in the boxes you left.
                        </p>
                    } 
                    { props.role === "hider" &&
                        <p>
                            You are a <b>Hider</b> having to hide your objects. You have four boxes in which you can hide them.<br/> 
                            Importantly, in some of the boxes the objects multiply.<br/>
                            After hiding your objects another participant, an Opener, will grab/snatch two of the boxes.
                            Whatever the Opener finds in those boxes the Opener gets; you get whatever remains in the
                            boxes left.
                        </p>
                    }
                    <p>
                        You will play the game three times with different sets of boxes.
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