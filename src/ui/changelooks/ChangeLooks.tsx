import React, { ButtonHTMLAttributes, ReactNode, RefObject } from 'react';
import Draggable from 'react-draggable';
import './changelooks.css';
import BobbaEnvironment from '../../bobba/BobbaEnvironment';
import { canvas2Image } from '../misc/GraphicsUtilities';
import AvatarInfo, { Gender, extractFigureParts, FigurePart, generateFigureString } from '../../bobba/imagers/avatars/AvatarInfo';
import WindowManager from '../windows/WindowManager';

type MainTabId = 'generic' | 'head' | 'torso' | 'legs';
type MainTab = {
    id: MainTabId,
    tabs: SecondaryTab[],
};

type SecondaryTab = {
    type: string,
    name: string,
    image: string,
    required: boolean,
};

const avatarMainTabs: MainTab[] = [
    {
        id: "generic",
        tabs: [
            {
                type: "hd",
                name: "Skin",
                image: "avatar_editor_download_icon",
                required: true,
            }
        ]
    },
    {
        id: "head",
        tabs: [
            {
                type: "hr",
                name: "Hair",
                image: "head_hair",
                required: false,
            },
            {
                type: "ha",
                name: "Hat",
                image: "head_hats",
                required: false,
            },
            {
                type: "he",
                name: "Accesories",
                image: "head_accessories",
                required: false,
            },
            {
                type: "ea",
                name: "Glass",
                image: "head_eyewear",
                required: false,
            },
            {
                type: "fa",
                name: "Masks",
                image: "head_face_accessories",
                required: false,
            }
        ]
    },
    {
        id: "torso",
        tabs: [
            {
                type: "ch",
                name: "Top",
                image: "top_shirt",
                required: true,
            },
            {
                type: "cc",
                name: "Jacket",
                image: "top_jacket",
                required: false,
            },
            {
                type: "ca",
                name: "Collar",
                image: "top_accessories",
                required: false,
            },
            {
                type: "cp",
                name: "More",
                image: "top_prints",
                required: false,
            }
        ]
    },
    {
        id: "legs",
        tabs: [
            {
                type: "lg",
                name: "Pants",
                image: "bottom_trousers",
                required: true,
            },
            {
                type: "sh",
                name: "Shoes",
                image: "bottom_shoes",
                required: false,
            },
            {
                type: "wa",
                name: "Belts",
                image: "bottom_accessories",
                required: false,
            }
        ]
    }
];

type ChangeLooksProps = {};

type ChangeLooksState = {
    visible: boolean,
    mainTab: MainTabId,
    secondTabId: number,
    look: string,
    gender: Gender,
    zIndex: number,
    grid: (ButtonWithFlag | SecondaryTabCurrent)[],
};

const initialState: ChangeLooksState = {
    visible: false,
    mainTab: 'generic',
    secondTabId: 0,
    look: '',
    gender: 'M',
    zIndex: WindowManager.getNextZIndex(),
    grid: [],
};

interface ButtonWithFlag {
    button: HTMLCanvasElement;
    isHc: boolean;
    figure: string; 
    partId: string; 
    selected: boolean; 
    type: MainTabId;
}

interface SecondaryTabCurrent {
    typeId: SecondaryTab;
    currentPart: FigurePart | null;
}

class ChangeLooks extends React.Component<ChangeLooksProps, ChangeLooksState>  {
    constructor(props: ChangeLooksProps) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        const game = BobbaEnvironment.getGame();
        game.uiManager.onOpenChangeLooks = (look => {
            this.setState({
                visible: true,
                look,
                zIndex: WindowManager.getNextZIndex()
            });
        });

        game.uiManager.onCloseChangeLooks = (() => {
            this.setState({
                visible: false,
            });
        });
    }

    componentDidUpdate(prevProps: Readonly<ChangeLooksProps>, prevState: Readonly<ChangeLooksState>, snapshot?: any): void {
    }

    getMainTabs(): ReactNode {
        const { mainTab } = this.state;
        return avatarMainTabs.map(mainTabDef => {
            return (
                <button key={mainTabDef.id} onClick={this.handleMainTabChange(mainTabDef.id)} className={mainTab === mainTabDef.id ? 'selected' : ''}>
                    <img src={"images/avatar_editor/ae_tabs_" + mainTabDef.id + ".png"} alt={mainTabDef.id} />
                </button>
            );
        });
    }

    getSecondTab(): ReactNode {
        const { mainTab, secondTabId, gender } = this.state;
        const mainDef = avatarMainTabs.find(value => value.id === mainTab);
        if (mainDef !== undefined) {
            let i = 0;
            if (mainDef.id === 'generic') {
                const maleImage = "images/avatar_editor/gender_male.png";
                const femaleImage = "images/avatar_editor/gender_female.png";
                const maleName = 'Boy';
                const femaleName = 'Girl';
                const maleSelected = gender === 'M';
                return (
                    <>
                        <button onClick={this.handleToggleGender('M')} className={'gender ' + (maleSelected ? 'selected' : '')}>
                            <img src={maleImage} alt={maleName} />
                            <span>{maleName}</span>
                        </button>
                        <button onClick={this.handleToggleGender('F')} className={'gender ' + (!maleSelected ? 'selected' : '')}>
                            <img src={femaleImage} alt={femaleName} />
                            <span>{femaleName}</span>
                        </button>
                    </>
                );
            } else {
                return mainDef.tabs.map(secondTabDef => {
                    const selected = secondTabId === i;
                    const name = secondTabDef.name;
                    const image = "images/avatar_editor/" + secondTabDef.image + ".png";
                    return (
                        <button key={secondTabDef.name} onClick={this.handleSecondTabChange(i++)} className={selected ? 'selected' : ''}>
                            <img src={image} alt={name} />
                        </button>
                    );
                });
            }

        }
        return [];
    }

    calculateCurrentColor(colorId: number): number {
        const { mainTab, secondTabId, look } = this.state;
        const mainDef = avatarMainTabs.find(value => value.id === mainTab);
        if (mainDef !== undefined) {
            const typeId = mainDef.tabs[secondTabId];
            const parts = extractFigureParts(look);
            const value = parts.find(value => {
                return value.type === typeId.type;
            });
            if (value !== undefined) {
                return parseInt(value.colors[colorId]);
            }
        }
        return 0;
    }

    calculateCurrentPart(): FigurePart | null {
        const { mainTab, secondTabId, look } = this.state;
        const mainDef = avatarMainTabs.find(value => value.id === mainTab);
        if (mainDef !== undefined) {
            const typeId = mainDef.tabs[secondTabId];
            const parts = extractFigureParts(look);
            const value = parts.find(value => {
                return value.type === typeId.type;
            });
            if (value !== undefined) {
                return value;
            }
        }
        return null;
    }

    generatePalette(paletteId: number): ReactNode {
        const { mainTab, secondTabId } = this.state;
        const mainDef = avatarMainTabs.find(value => value.id === mainTab);
        if (mainDef !== undefined) {
            const typeId = mainDef.tabs[secondTabId];
            if (typeId != null) {
                const ogPalettes = BobbaEnvironment.getGame().avatarImager.getPartPalette(typeId.type);
                const colors: ReactNode[] = [];
                const currentColor = this.calculateCurrentColor(paletteId);
                for (let colorIdStr in ogPalettes) {
                    const colorId = parseInt(colorIdStr);
                    const colorData = ogPalettes[colorId];
                    const selected = colorId === currentColor;
                    const isHc = colorData.club !== 0;
                    colors.push(
                        <button onClick={this.handleChangeColor(paletteId, colorId)} key={colorId} className={(selected ? 'selected ' : '') + (isHc ? 'hc ' : '')}>
                            <div className="palette" style={{ backgroundColor: '#' + colorData.color }}></div>
                        </button>
                    );
                }
                return colors;
            }
        }
        return [];
    }

    generatePalettes(): ReactNode {
        const currentPart = this.calculateCurrentPart();
        const palettes: ReactNode[] = [];
        let colorCount = 1;
        if (currentPart != null) {
            colorCount = BobbaEnvironment.getGame().avatarImager.getPartPaletteCount(currentPart.type, currentPart.id);
        }
        for (let i = 0; i < colorCount; i++) {
            palettes.push(
                <div key={i} className="colors_container" >
                    {this.generatePalette(i)}
                </div>
            );
        }


        return palettes;
    }

    generatePartImage(figure: string, selected: boolean, type: MainTabId): Promise<HTMLCanvasElement> {
        const avatarImager = BobbaEnvironment.getGame().avatarImager;
        const promise: Promise<HTMLCanvasElement> = new Promise((resolve, reject) => {
            resolve(avatarImager.generateGeneric(new AvatarInfo(figure, 4, 4, ["std"], "std", 0, type === 'generic', false, "n"), false))
        })
        return promise
    }

    generatePlatform(): ReactNode {
        const { look } = this.state;
        if (look === '') {
            return (<></>);
        }

        const ref: RefObject<HTMLImageElement> = React.createRef();
        const avatarImager = BobbaEnvironment.getGame().avatarImager;

        avatarImager.generateGeneric(new AvatarInfo(look, 4, 4, ["std"], "std", 0, false, false, "n"), false).then(canvas => {
            const image = canvas2Image(canvas);
            const renderedImg = ref.current;
            if (renderedImg != null) {
                renderedImg.src = image.src;
                renderedImg.className += ' loaded';
            }
        });

        return (
            <img ref={ref} alt="Me" />
        );
    }

    generateGrid(): Promise<ButtonWithFlag | SecondaryTabCurrent>[] {
        const { mainTab, secondTabId, gender } = this.state;
        const mainDef = avatarMainTabs.find(value => value.id === mainTab);
        if (mainDef !== undefined) {
            const typeId = mainDef.tabs[secondTabId];
            if (typeId != null) {
                const partSet = BobbaEnvironment.getGame().avatarImager.getPartSet(typeId.type);
                const parts: Promise<ButtonWithFlag | SecondaryTabCurrent>[] = [];
                const currentPart = this.calculateCurrentPart();
                let currentColor = this.calculateCurrentColor(0).toString();
                if (currentPart != null && currentPart.colors.length > 1) {
                    currentColor += "-" + this.calculateCurrentColor(1);
                }
                if (!typeId.required) {
                    parts.push(new Promise(() => {return {secondaryTab: typeId, currentPart: currentPart}}));
                }
                for (let partId in partSet) {
                    const part = partSet[partId];
                    const selected = currentPart != null && currentPart.id === partId;
                    const isHc = part.club !== 0;
                    const figure = typeId.type + "-" + partId + "-" + currentColor;
                    if ((part.gender === gender || part.gender === 'U') && part.selectable) {
                        parts.push(this.generatePartImage(figure, selected, mainDef.id).then(image => {
                            return {button: image, figure: figure, partId: partId, selected: selected, type: mainDef.id, isHc: isHc}
                        }));
                    }
                }
                return parts;
            }
        }
        return [];
    }

    handleMainTabChange = (mainTab: MainTabId) => () => {
        this.setState({
            grid: [],
            mainTab,
            secondTabId: 0,
        });
        Promise.all(this.generateGrid())
            .then(grid => this.setState({grid: grid}))
    }

    handleSecondTabChange = (secondTabId: number) => () => {
        this.setState({
            secondTabId,
        });
    }

    handleChangePart = (figure: string) => () => {
        const { look } = this.state;
        const newLook = generateFigureString(extractFigureParts(look + "." + figure));

        this.setState({
            look: newLook,
        });
    }

    handleChangeColor = (paletteId: number, colorId: number) => () => {
        const { look } = this.state;
        const currentPart = this.calculateCurrentPart();
        if (currentPart != null) {
            currentPart.colors[paletteId] = colorId.toString();
            const newLook = generateFigureString(extractFigureParts(look + "." + generateFigureString([currentPart])));
            this.setState({
                look: newLook,
            });
        }
    }

    handleRemovePart = (type: string) => () => {
        const { look } = this.state;
        const newLook = generateFigureString(extractFigureParts(look).filter(value => value.type !== type));

        this.setState({
            look: newLook,
        });
    }

    handleToggleGender = (gender: Gender) => () => {
        this.setState({
            gender,
        });
    }

    handleSaveChanges = () => {
        this.setState({ visible: false });
        const { look, gender } = this.state;
        BobbaEnvironment.getGame().uiManager.doChangeLooks(look, gender);
    }

    handleClose = () => {
        this.setState({ visible: false });
    }
    upgradeZIndex = () => {
        this.setState({
            zIndex: WindowManager.getNextZIndex(),
        });
    }
    render() {
        const { visible, zIndex } = this.state;
        if (!visible) {
            return <></>;
        }
        return (
            <Draggable defaultClassName="avatar_editor" handle=".title" onStart={() => this.upgradeZIndex()} onMouseDown={() => this.upgradeZIndex()}>
                <div style={{ zIndex }}>
                    <button className="close" onClick={this.handleClose}>
                        X
                    </button>
                    <h2 className="title">
                        Change your looks
                    </h2>
                    <hr />
                    <div className="main_tab_container">
                        {this.getMainTabs()}
                    </div>
                    <div className="parts_container">
                        <div className="second_tab_container">
                            {this.getSecondTab()}
                        </div>
                        <div className="first_row">
                            <div className="parts_grid">
                                {this.state.grid.map(canvas => {
                                    if ((canvas as ButtonWithFlag).button) {
                                        const ref: RefObject<HTMLImageElement> = React.createRef();
                                       
                                        var button = (canvas as ButtonWithFlag)
                                        const image = canvas2Image(button.button);
                                        const renderedImg = ref.current;
                                        if (renderedImg != null) {
                                            renderedImg.src = image.src;
                                            renderedImg.className = button.type + (button.selected ? ' selected ' : '');
                                        }
                                        return <button onClick={this.handleChangePart(button.figure)} key={button.partId} className={(button.selected ? 'selected ' : '') + (button.isHc ? 'hc ' : '')}>
                                            <img className={button.selected ? 'selected ' : ''} ref={ref} src="images/avatar_editor/avatar_editor_download_icon.png" alt={button.figure} />
                                        </button>
                                    } else {
                                        var button0 = (canvas as SecondaryTabCurrent)
                                        return <button onClick={this.handleRemovePart(button0.typeId.type)} key={-1} className={(button0.currentPart == null ? 'selected ' : '')}>
                                            <img src="images/avatar_editor/removeSelection.png" alt="Remove" />
                                        </button>
                                    }
                                })}
                            </div>
                            <div className="platform">
                                {this.generatePlatform()}
                            </div>
                        </div>
                        <div className="palette_container">
                            {this.generatePalettes()}
                        </div>
                    </div>
                    <div className="button_container">
                        <button onClick={this.handleClose}>
                            Cancel
                        </button>
                        <button onClick={this.handleSaveChanges}>
                            Save changes
                        </button>
                    </div>
                </div>
            </Draggable>
        );
    }
}

export default ChangeLooks;