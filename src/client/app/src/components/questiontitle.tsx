import { IQuestionTitleComponent } from "../utils/componentInterfaces";

export default function QuestionTitle({title, subtitle}: IQuestionTitleComponent) {
    return (
        <div className="text-left">
            <h1 className="poppins font-medium text-base">{title}</h1>
            <h2 className="poppins font-normal text-sm italic">{subtitle}</h2>
        </div>
    )
}