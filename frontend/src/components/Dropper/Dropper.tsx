import { DropperProps } from '../../types';

const Dropper = ({ importRef, dragging, onDrag, onDrop }: DropperProps) => {
    return (
        <form id="image-dropper" onSubmit={(e) => e.preventDefault()}>
            <input
                ref={importRef}
                id="input-file-upload"
                type="file"
                accept="image/*"
                onChange={onDrop}
                multiple={true}
            />

            <label id="label-file-upload" htmlFor="input-file-upload">
                <div>
                    <h3>Drag and drop the image you want to use as the base inspiration for your Orb here.</h3>
                </div>
            </label>

            {dragging && (
                <div
                    id="drag-file-element"
                    onDragEnter={onDrag}
                    onDragLeave={onDrag}
                    onDragOver={onDrag}
                    onDrop={onDrop}
                ></div>
            )}
        </form>
    );
};

export { Dropper };
