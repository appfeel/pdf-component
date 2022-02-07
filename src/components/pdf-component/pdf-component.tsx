import { initialize } from '@ionic/core';
import { Component, Prop, Element, Watch, Event, EventEmitter, h, State } from '@stencil/core';
import pdf from 'pdfjs-dist/build/pdf';
import { PDFDocumentProxy, RenderParameters } from 'pdfjs-dist/types/src/display/api';

// Works well with 2.12.313
pdf.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdf.version}/pdf.worker.min.js`;

/**
 * PDF Viewing component
 */
@Component({
    tag: 'pdf-component',
    styleUrl: 'pdf-component.css',
    shadow: true,
})

export class PDFComponent {
    @Element() component: HTMLElement;

    @State() pdfZoom = 1;
    @State() pdfDocument: PDFDocumentProxy;

    private pdfContext: HTMLDivElement;
    private btns: HTMLIonButtonsElement;
    private zoomButtonsHideTimeout: any;
    private isDocumentLoading = false;

    /** PDF document source */
    @Prop() src: string;

    /** Emitted when a page has been rendered */
    @Event() pageRendered: EventEmitter<number>;

    constructor() {
        initialize();
    }

    componentDidLoad(): void {
        const width = this.pdfContext.offsetWidth;
        const height = this.pdfContext.offsetHeight;
        this.pdfContext.setAttribute('style', `width: ${width}px`);
        this.pdfContext.style.width = `${width} px`;
        this.pdfContext.setAttribute('style', `height: ${height}px`);
        this.pdfContext.style.height = `${height} px`;

        if (this.src && !this.pdfDocument) {
            this.updateSrc(this.src, null);
        }
    }

    @Watch('src')
    async updateSrc(newValue: string | null, oldValue: string | null) {
        if (newValue === oldValue) {
            return;
        }
        this.isDocumentLoading = true;
        // Refresh view while document is loading...
        this.pdfDocument = null;
        this.pdfDocument = await pdf.getDocument(newValue).promise;
        this.isDocumentLoading = false;
    }

    private handleZoom(newZoom: number) {
        this.pdfZoom = newZoom;
    }

    private handleMouseEnter() {
        this.btns?.classList.add('active');
        clearTimeout(this.zoomButtonsHideTimeout);
    }

    private handleMouseLeave() {
        this.zoomButtonsHideTimeout = setTimeout(() => this.btns?.classList.remove('active'), 1000);
    }

    private handleMouseMove() {
        this.handleMouseEnter();
        this.handleMouseLeave();
    }

    /** Page rotation in degrees */
    async renderPage(pageNum: number, canvas: HTMLCanvasElement, rotation: 0 | 90 | 180 | 270 | 360 = 0) {
        const currentPage = await this.pdfDocument.getPage(pageNum);

        // Fit page on pdfContext width and then adjust zoom
        let viewport = currentPage.getViewport({ scale: 1, rotation });
        const scale = (this.pdfContext.offsetWidth - 15) / viewport.width; // 10 px margin for cards
        viewport = currentPage.getViewport({ scale: this.pdfZoom * scale, rotation });

        // Set canvas size
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        canvas.parentElement.setAttribute('style', `width:${canvas.width}px;height:${canvas.height}px`);
        canvas.parentElement.style.width = `${canvas.width}px`;
        canvas.parentElement.style.height = `${canvas.height}px`;

        // Render PDF page into canvas context
        const renderContext: RenderParameters = {
            viewport,
            canvasContext: canvas.getContext('2d'),
        };

        // Wait for rendering to finish
        await currentPage.render(renderContext).promise;
        this.pageRendered.emit(pageNum);
    }

    renderPageCard(pageNum: number) {
        return <ion-card>
            <canvas ref={r => this.renderPage(pageNum, r)} />
        </ion-card>;
    }

    renderDocument() {
        if (this.pdfDocument && !this.isDocumentLoading) {
            return [...Array(this.pdfDocument.numPages).keys()].map(p => this.renderPageCard(p + 1))
        }

        return <center><ion-spinner name="dots"></ion-spinner></center>;
    }

    renderButtons() {
        if (this.pdfDocument) {
            return <ion-buttons ref={e => (this.btns = e)} class='pdf-zoom-buttons active'
                onMouseEnter={() => this.handleMouseEnter()}
                onMouseLeave={() => this.handleMouseLeave()}
            >
                <ion-button onClick={() => this.handleZoom(this.pdfZoom - 0.1)}>
                    <ion-icon slot="icon-only" name="remove-outline" />
                </ion-button>
                <ion-button onClick={() => this.handleZoom(1)}>
                    <ion-icon slot="icon-only" name="refresh" />
                </ion-button>
                <ion-button onClick={() => this.handleZoom(this.pdfZoom + 0.1)}>
                    <ion-icon slot="icon-only" name="add" />
                </ion-button>
                <ion-button onClick={() => window.open(this.src, '_blank')}>
                    <ion-icon slot="icon-only" name="open-outline" />
                </ion-button>
            </ion-buttons>;
        }
        return null;
    }

    render() {
        return (
            <div ref={e => (this.pdfContext = e)} class="pdf-context">
                <div class="pdf-container" onMouseMove={() => this.handleMouseMove()}>
                    {this.renderButtons()}
                    {this.renderDocument()}
                </div>
            </div>
        );
    }
}
