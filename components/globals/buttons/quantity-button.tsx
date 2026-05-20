import { RiAddLine, RiSubtractFill } from "@remixicon/react"
import { BodyText } from "../typography/body-text"

const QuantityButton = ({ icon, onClick, disabled }: { icon: string; onClick?: () => void, disabled?: boolean }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`group transition-all duration-300 border border-dark-5 w-full h-10 px-7 py-3 flex justify-center items-center ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark-100 cursor-pointer'}`}
        >
            <BodyText variant="14m" as="span" className={`text-dark-100 ${disabled ? '' : 'group-hover:text-white'}`}>
                {icon === "plus" ? <RiAddLine size={18} /> : <RiSubtractFill size={18} />}
            </BodyText>
        </button>
    )
}

export default QuantityButton