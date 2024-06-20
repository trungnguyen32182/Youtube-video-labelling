import './Switch.css';

const Switch = ({ toggle, onToggle }) => {
    const handleToggle = () => {
        onToggle(!toggle);
    };

    return (
        <div>
            <input id="checkbox_toggle" type="checkbox" className="check" checked={toggle} onChange={handleToggle} />
            <div className="checkbox">
                <label className="slide" htmlFor="checkbox_toggle">
                    <label className="toggle" htmlFor="checkbox_toggle"></label>
                    <label className="text" htmlFor="checkbox_toggle">Comments</label>
                    <label className="text" htmlFor="checkbox_toggle">Transcripts</label>
                </label>
            </div>
        </div>
    );
}

export default Switch;
