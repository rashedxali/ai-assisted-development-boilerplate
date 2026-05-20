import { BodyText } from "../typography/body-text"

const SizeButton = ({ text, isSelected, onClick, className, disabled }: { text: string | number; isSelected?: boolean; onClick?: () => void, className?: string, disabled?: boolean }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`group hover:bg-dark-100 cursor-pointer transition-all duration-300 border h-10 px-7 py-3 flex justify-center items-center ${isSelected ? 'bg-dark-100 border-dark-100' : 'border-dark-5 bg-transparent'} ${disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''} ${className || 'w-17.2'}`}
        >
            <BodyText variant="14m" as="span" className={`transition-colors duration-300 ${isSelected ? 'text-white' : 'text-dark-100 group-hover:text-white'}`}>
                {text}
            </BodyText>
        </button>
    )
}

export default SizeButton