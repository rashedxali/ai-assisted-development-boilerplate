import Image from 'next/image'

const PrintSelectButton = ({ print, isSelected, onClick }: { print: string; isSelected?: boolean; onClick?: () => void }) => {
    return (
        <button
            onClick={onClick}
            className={`cursor-pointer rounded-full h-7 w-7 flex items-center justify-center transition-all duration-300 outline-none border ${isSelected ? 'border-dark-100' : 'border-transparent'} hover:border-dark-100`}
        >
            <Image src={print} alt='print' width={20} height={20} className='h-5 w-5 object-cover rounded-full' />
        </button>
    )
}

export default PrintSelectButton