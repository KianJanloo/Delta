export interface IModal {
    onClick?: () => void
    title?: string
    buttonTitle?: string
    buttonIcon?: React.ReactNode,
    button?: React.ReactNode,
    handleClick?: string
}