import React from "react";
import Draggable from "react-draggable";
import './confirmpurchase.css';
import CatalogueItem from "../../bobba/catalogue/CatalogueItem";
import { canvas2Image } from "../misc/GraphicsUtilities";

type ConfirmPurchaseProps = {
    item: CatalogueItem,
    onClose: () => void,
    onPurchase: () => void,
    zIndex: number,
};
type ConfirmPurchaseState = {
    visible: boolean,
};
const initialState: ConfirmPurchaseState = {
    visible: true,
};

export default class ConfirmPurchase extends React.Component<ConfirmPurchaseProps, ConfirmPurchaseState> {

    constructor(props: ConfirmPurchaseProps) {
        super(props);
        this.state = initialState;
    }

    render() {
        const { item, onClose, onPurchase, zIndex } = this.props;
        if (item.baseItem == null) {
            return <></>;
        }
        const image = canvas2Image(item.baseItem.iconImage);
        return (
            <Draggable handle=".handle">
                <div className="catalogue_confirm_purchase" style={{ zIndex }}>
                    <button className="close" onClick={onClose}>
                        X
                    </button>
                    <h2 className="handle">Confirm purchase</h2>
                    <hr />
                    <div className="wrapper">
                        <div className="first_row">
                            <button>
                                <img src={image.src} alt={item.baseItem.furniBase.itemData.name} />
                            </button>
                            <h2>
                                {item.baseItem.furniBase.itemData.name}
                            </h2>
                        </div>
                        <div className="second_row">
                            <p>
                                {item.baseItem.furniBase.itemData.name} costs {item.cost} credit{item.cost === 1 ? '' : 's'}.
                            </p>
                            <p>
                                You have 420 credits.
                            </p>
                        </div>
                        <div className="third_row">
                            <button onClick={onPurchase}>Buy</button>
                            <button>Give a present</button>
                            <button onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                </div>
            </Draggable>
        );
    }
}