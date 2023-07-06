import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
    selector: '[AngularComponentLongPress]'
})
export class LongPressDirective {
    @Input() longPressParams: LongPressInputParams;
    @Output() longPressedEvent: EventEmitter<any> = new EventEmitter();

    isMouseDown: boolean = false;
    contextTimeout: any;

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.el.nativeElement.addEventListener('mousedown', this.mouseDown.bind(this));
        this.el.nativeElement.addEventListener('touchstart', this.mouseDown.bind(this));
        this.el.nativeElement.addEventListener('mouseup', this.mouseUp.bind(this));
        this.el.nativeElement.addEventListener('touchend', this.mouseUp.bind(this));
        this.el.nativeElement.addEventListener('mousemove', this.mouseUp.bind(this));
        this.el.nativeElement.addEventListener('touchmove', this.mouseUp.bind(this));
    }

    mouseDown(e: any) {
        e.target.parentElement.classList.add('touch-active');
        this.isMouseDown = true;
        this.contextTimeout = setTimeout(() => {
            if (this.isMouseDown) {
                let item = e.target.parentElement;
                if (item.tagName.toLowerCase() == "tr")
                    this.longPressedEvent.emit(this?.longPressParams?.returnParams || null);
                else {
                    item = item.parentElement;
                    this.longPressedEvent.emit(this?.longPressParams?.returnParams || null);
                }
            }
        }, this.longPressParams?.time && this.longPressParams.time > 0 ? this.longPressParams.time : 1000);
    }

    mouseUp(e: any) {
        e.target.parentElement.classList.remove('touch-active');
        clearTimeout(this.contextTimeout);
        this.isMouseDown = false;
    }
}

export interface LongPressInputParams {
    time?: number;
    returnParams?: Object;
} 