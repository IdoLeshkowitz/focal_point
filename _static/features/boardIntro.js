function renderInstructionsPage(props) {
    const jsxCode = `
        function Stam(){
            return <div></div>
        }
        const pages = (role)=> [
            <section>
                    <p>
                        Now that you have passed the test the game proceeds as follows:
                    </p>
                    <p>
                        If you are a Hider, you will hide objects in three sets of four boxes.<br/>
                        If you are an Opener, you will see the same three sets of four boxes, and in each set choose two boxes that will be opened later.<br/>
                        You will then be randomly matched with an opponent of the other role. One of your three sets will be randomly chosen, the chosen boxes will be opened, and your bonus will be calculated based on the total number of objects in the boxes you get (chosen by the Opener or left for the Hider).<br/>
                        Each object is worth # Pence.
                    </p>
                    { role === "hider" && 
                        <p>
                            You are a <b>Hider</b>. In each set of boxes you need to hide all of your objects. You can hide
                            anywhere between zero and all of your objects in a box. The multiplication rate of each box is
                            indicated under it, and the objects hidden there will be multiplied by this rate. Objects in the
                            boxes not chosen by your matched Opener will be yours.
                        </p>
                    }
                    { role === "seeker" &&
                        <p>
                            You are an <b>Opener</b>. In each set of boxes you need to choose two of the four boxes. The
                            multiplication rate of each box is indicated under it, and the objects hidden there will be
                            multiplied by this rate. These boxes will later be opened and the objects in them will be yours;
                            objects in the remaining boxes will be the Hider’s.
                        </p>
                    }
            </section>,
            <section>
                <p>
                    The game involves a number of boxes and a number of objects to be hidden in the boxes.<br/>
                    Each box has a value by which the number of objects in the box is multiplied (the boxes’ multiplication rate)...<br/>
                </p> 
            </section>   
        ]
        function InstructionsPage(props){
            const [page, setPage] = React.useState(0)
            function onClick(){
                const nextPage = page + 1
                const isLastPage = nextPage === pages.length
                if(isLastPage){
                    document.querySelector("form").submit()
                } else {
                    setPage(nextPage)
                }
            }
                
            return (
                <>
                    {pages(props.role)[page]}
                    <div class="button-container">
                        <button class="btn btn-primary" type="button" onClick={onClick}>Proceed</button>
                    </div>
                </>
           )
        }
    `
    renderReactComponent(jsxCode, "react-root", "InstructionsPage", JSON.stringify(js_vars));
}

window.addEventListener("load", () => {
    renderInstructionsPage()
})