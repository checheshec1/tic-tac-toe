import "./components.css"

const Square = ({value, onClick, disable}) => {
    return (
        <button className={"square"} onClick={onClick} disabled={disable}>
            {value}
        </button>
    )
}

export default Square;