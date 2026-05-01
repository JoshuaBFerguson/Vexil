import Vexil from "../vexil";

export type ElementRectInput = {
    width: number;
    height: number;
    x?: number;
    y?: number;
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
};

export type ElementLike = {
    getBoundingClientRect(): ElementRectInput;
};

export type ElementDimensionsInput = ElementRectInput | ElementLike;

function isElementLike(input: ElementDimensionsInput): input is ElementLike {
    return typeof (input as ElementLike).getBoundingClientRect === "function";
}

function isFiniteNumber(input: number | undefined): input is number {
    return typeof input === "number" && Number.isFinite(input);
}

function approximatelyEqual(left: number, right: number, tolerance = 0.01): boolean {
    return Math.abs(left - right) <= tolerance;
}

export class VexilElementDimensions extends Vexil<ElementDimensionsInput> {
    public width?: number;
    public height?: number;
    public x?: number;
    public y?: number;
    public top?: number;
    public right?: number;
    public bottom?: number;
    public left?: number;
    public area?: number;
    public aspectRatio?: number;
    public centerX?: number;
    public centerY?: number;

    static fromElement(element: ElementLike): ElementRectInput {
        const rect = element.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
            left: rect.left
        };
    }

    constructor(input: ElementDimensionsInput) {
        super(input);
        this.parse();
    }

    protected override parse() {
        this.width = undefined;
        this.height = undefined;
        this.x = undefined;
        this.y = undefined;
        this.top = undefined;
        this.right = undefined;
        this.bottom = undefined;
        this.left = undefined;
        this.area = undefined;
        this.aspectRatio = undefined;
        this.centerX = undefined;
        this.centerY = undefined;

        const rect = isElementLike(this.value) ? this.value.getBoundingClientRect() : this.value;
        if (!isFiniteNumber(rect.width) || !isFiniteNumber(rect.height)) {
            return;
        }

        const left = rect.left ?? rect.x ?? 0;
        const top = rect.top ?? rect.y ?? 0;
        if (!isFiniteNumber(left) || !isFiniteNumber(top)) {
            return;
        }

        this.width = rect.width;
        this.height = rect.height;
        this.left = left;
        this.top = top;
        this.x = rect.x ?? left;
        this.y = rect.y ?? top;
        this.right = rect.right ?? left + rect.width;
        this.bottom = rect.bottom ?? top + rect.height;
        this.area = rect.width * rect.height;
        this.aspectRatio = rect.height === 0 ? undefined : rect.width / rect.height;
        this.centerX = left + rect.width / 2;
        this.centerY = top + rect.height / 2;
    }

    public override validate(...args: (boolean | ((inst: VexilElementDimensions) => boolean))[]): boolean {
        this.parse();
        return super.validate(
            ...args,
            isFiniteNumber(this.width),
            isFiniteNumber(this.height),
            isFiniteNumber(this.left),
            isFiniteNumber(this.top),
            isFiniteNumber(this.right),
            isFiniteNumber(this.bottom),
            this.width !== undefined && this.width >= 0,
            this.height !== undefined && this.height >= 0,
            this.left !== undefined && this.right !== undefined && approximatelyEqual(this.right - this.left, this.width ?? Number.NaN),
            this.top !== undefined && this.bottom !== undefined && approximatelyEqual(this.bottom - this.top, this.height ?? Number.NaN)
        );
    }

    static visible() {
        return (inst: VexilElementDimensions): boolean => (inst.width ?? 0) > 0 && (inst.height ?? 0) > 0;
    }

    static empty() {
        return (inst: VexilElementDimensions): boolean => (inst.width ?? 0) === 0 || (inst.height ?? 0) === 0;
    }

    static minWidth(num: number) {
        return (inst: VexilElementDimensions): boolean => inst.width !== undefined && inst.width >= num;
    }

    static maxWidth(num: number) {
        return (inst: VexilElementDimensions): boolean => inst.width !== undefined && inst.width <= num;
    }

    static minHeight(num: number) {
        return (inst: VexilElementDimensions): boolean => inst.height !== undefined && inst.height >= num;
    }

    static maxHeight(num: number) {
        return (inst: VexilElementDimensions): boolean => inst.height !== undefined && inst.height <= num;
    }

    static minArea(num: number) {
        return (inst: VexilElementDimensions): boolean => inst.area !== undefined && inst.area >= num;
    }

    static maxArea(num: number) {
        return (inst: VexilElementDimensions): boolean => inst.area !== undefined && inst.area <= num;
    }

    static aspectRatio(ratio: number, tolerance = 0.01) {
        return (inst: VexilElementDimensions): boolean =>
            inst.aspectRatio !== undefined && approximatelyEqual(inst.aspectRatio, ratio, tolerance);
    }

    static landscape() {
        return (inst: VexilElementDimensions): boolean =>
            inst.width !== undefined && inst.height !== undefined && inst.width > inst.height;
    }

    static portrait() {
        return (inst: VexilElementDimensions): boolean =>
            inst.width !== undefined && inst.height !== undefined && inst.height > inst.width;
    }

    static square(tolerance = 0.01) {
        return (inst: VexilElementDimensions): boolean =>
            inst.width !== undefined && inst.height !== undefined && approximatelyEqual(inst.width, inst.height, tolerance);
    }

    static withinViewport(width: number, height: number) {
        return (inst: VexilElementDimensions): boolean =>
            inst.left !== undefined &&
            inst.top !== undefined &&
            inst.right !== undefined &&
            inst.bottom !== undefined &&
            inst.left >= 0 &&
            inst.top >= 0 &&
            inst.right <= width &&
            inst.bottom <= height;
    }

    static intersectsViewport(width: number, height: number) {
        return (inst: VexilElementDimensions): boolean =>
            inst.left !== undefined &&
            inst.top !== undefined &&
            inst.right !== undefined &&
            inst.bottom !== undefined &&
            inst.right > 0 &&
            inst.bottom > 0 &&
            inst.left < width &&
            inst.top < height;
    }

    static above(y: number) {
        return (inst: VexilElementDimensions): boolean => inst.bottom !== undefined && inst.bottom <= y;
    }

    static below(y: number) {
        return (inst: VexilElementDimensions): boolean => inst.top !== undefined && inst.top >= y;
    }

    static leftOf(x: number) {
        return (inst: VexilElementDimensions): boolean => inst.right !== undefined && inst.right <= x;
    }

    static rightOf(x: number) {
        return (inst: VexilElementDimensions): boolean => inst.left !== undefined && inst.left >= x;
    }
}
