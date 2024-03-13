import _ from "lodash";

export const getpdfTemplate = (templateName: string) => {
    return PDF_TEMPLATE;
}

export const TEMPLATE_CONTENT: any = {
    SIFA: `
<p>vielen Dank für Ihre Anfrage nach einem Angebot. </p>
<p>Arbeitsschutz soll Leben und Gesundheit der Arbeitnehmer schützen, ihre Arbeitskraft erhalten sowie die Arbeit menschengerecht gestalten. Arbeitsschutzrechtliche Sicherungen und Gesundheitsschutz sind gesetzliche Grundlage des Arbeitsschutzgesetzes (ArbSchG) und erlassener Bestimmungen und Vorschriften der Berufsgenossenschaften.</p>
<p>Als erfahrener Dienstleister kann und möchte Ihnen Expert People | Management GmbH im Bereich der Arbeitssicherheit, insbesondere aufgrund des demographischen Wandels sowie des Fach- und Führungskräftemangels, kompetent zur Seite stehen.
Im Mittelpunkt unserer Arbeit steht die nachhaltige Verknüpfung aller Akteure des Arbeitsmarkts. Die Arbeitssicherheit ist ein Baustein, der in Zeiten des Fachkräftemangels weiter an Bedeutung gewinnen wird.
Unsere Kunden werden mit elektronischen Medien versorgt, was auf sehr guten EDV-Kenntnissen basiert. Wir würden Sie selbstverständlich mit unserem kostenlosen Newsletter und einer eigenen Schriftenreihe, rund um den Arbeitsschutz, bedienen.
</p>

<p>Unsere Mitarbeiter verfügen über ein abgeschlossenes Studium im Bereich Ingenieurwesen bzw. erfolgreich abgeschlossene Ausbildungen zum Meister bzw. Techniker. Alle verfügen über die Ausbildung zur Sicherheitsfachkraft und einschlägige Berufserfahrungen im Bereich der Arbeitssicherheit.</p>
<p>Als Dienstleister besitzen unsere Mitarbeiter eine hohe Serviceorientierung und ein verbindliches Auftreten. Sie sind flexibel, kommunikativ, durchsetzungsfähig und engagieren sich in allen Fragen des Arbeits- und Gesundheitsschutzes.</p>

<p>Die Deutsche Gesetzliche Unfallversicherung (DGUV) hat in der Vorschrift 2 geregelt, wie jedes Unternehmen seine diesbezüglichen Verpflichtungen erfüllt.</p>
<p><b>Wir erlauben uns, Ihnen diesbezüglich folgendes Angebot zu unterbreiten:</b></p>
<p>Als Fachkraft für Arbeitssicherheit beraten und unterstützen wir Sie und die sonst für den Arbeitsschutz und die Unfallverhütung verantwortlichen Personen insbesondere bei</p>
<ol type="a">
<li>der Planung, Ausführung und Unterhaltung von Betriebsanlagen und von sozialen und sanitären Einrichtungen,</li>
<li>der Beschaffung von technischen Arbeitsmitteln und der Einführung von Arbeitsverfahren und Arbeitsstoffen,</li>
<li>der Auswahl und Erprobung von Körperschutzmitteln</li>
<li>der Gestaltung der Arbeitsplätze, des Arbeitsablaufs, der Arbeitsumgebung und in sonstigen Fragen der Ergonomie</li>
<li>der Beurteilung der Arbeitsbedingungen,</li>
<li>die Betriebsanlagen und die technischen Arbeitsmittel insbesondere vor der Inbetriebnahme und Arbeitsverfahren insbesondere vor ihrer Einführung sicherheitstechnisch zu überprüfen</li>
<li>die Durchführung des Arbeitsschutzes und der Unfallverhütung zu beobachten und im Zusammenhang damit
        <ol>
            <li class="ql-indent-1">die Arbeitsstätten in regelmäßigen Abständen zu begehen und festgestellte Mängel dem Arbeitgeber oder der sonst für den Arbeitsschutz und die Unfallverhütung verantwortlichen Person mitzuteilen</li>
            <li class="ql-indent-1">Maßnahmen zur Beseitigung dieser Mängel vorzuschlagen und auf deren Durchführung hinzuwirken</li>
            <li class="ql-indent-1">auf die Benutzung der Körperschutzmittel zu achten,</li>
            <li class="ql-indent-1">Ursachen von Arbeitsunfällen zu untersuchen, die Untersuchungsergebnisse zu erfassen und auszuwerten und dem Arbeitgeber Maßnahmen zur Verhütung dieser Arbeitsunfälle vorzuschlagen,</li>
        </ol>
        </li>
        <li>darauf hinzuwirken, dass sich alle im Betrieb Beschäftigten den Anforderungen des Arbeitsschutzes und der Unfallverhütung entsprechend verhalten, insbesondere sie über die Unfall- undGesundheitsgefahren, denen sie bei der Arbeit ausgesetzt sind, sowie über die Einrichtungen und Maßnahmen zur Abwendung dieser Gefahren zu belehren und bei der Schulung der Sicherheitsbeauftragten mitzuwirken.</li>
    </ol>
    <p>Für Ihr Unternehmen haben Sie die Möglichkeit der Durchführung von <b>betrieblicher Grundbetreuungen und anlassbezogener, spezifischer Betreuung. Die spezifische Betreuung muss explizit festgelegt werden, kann aber auch kombiniert mit der betrieblichen Grundbetreuung vereinbart werden.</b>
    Die betriebsspezifische Betreuung trägt den speziellen Erfordernissen des jeweiligen Betriebs Rechnung, wie sie zum Beispiel aus seiner Art und Größe hervorgehen. Sie geht immer von spezifischen betrieblichen Gefährdungen, Situationen und Anlässen aus.
    Der inhaltliche Bedarf und der Umfang der betriebsspezifischen Betreuung müssen vom Unternehmer ermittelt werden. Dementsprechend sind auch für die betriebsspezifische Betreuung keine festen Einsatzzeiten vorgeschrieben, können aber im Bedarfsfall vereinbart werden.
    </p>`,
    QM: `<p>vielen Dank für Ihre Anfrage nach einem Angebot. </p> <p>Für Ihr Unternehmen haben Sie die Möglichkeit der Durchführung von <b>betrieblicher Grundbetreuungen und anlassbezogener, spezifischer Betreuung. Die spezifische Betreuung muss explizit festgelegt werden, kann aber auch kombiniert mit der betrieblichen Grundbetreuung vereinbart werden.</b>
    Die betriebsspezifische Betreuung trägt den speziellen Erfordernissen des jeweiligen Betriebs Rechnung, wie sie zum Beispiel aus seiner Art und Größe hervorgehen. Sie geht immer von spezifischen betrieblichen Gefährdungen, Situationen und Anlässen aus.
    Der inhaltliche Bedarf und der Umfang der betriebsspezifischen Betreuung müssen vom Unternehmer ermittelt werden. Dementsprechend sind auch für die betriebsspezifische Betreuung keine festen Einsatzzeiten vorgeschrieben, können aber im Bedarfsfall vereinbart werden.
    </p>` ,
    SiGeKo: `<p>vielen Dank für Ihre Anfrage nach einem Angebot. </p> <p>Für Ihr Unternehmen haben Sie die Möglichkeit der Durchführung von <b>betrieblicher Grundbetreuungen und anlassbezogener, spezifischer Betreuung. Die spezifische Betreuung muss explizit festgelegt werden, kann aber auch kombiniert mit der betrieblichen Grundbetreuung vereinbart werden.</b>
    Die betriebsspezifische Betreuung trägt den speziellen Erfordernissen des jeweiligen Betriebs Rechnung, wie sie zum Beispiel aus seiner Art und Größe hervorgehen. Sie geht immer von spezifischen betrieblichen Gefährdungen, Situationen und Anlässen aus.
    Der inhaltliche Bedarf und der Umfang der betriebsspezifischen Betreuung müssen vom Unternehmer ermittelt werden. Dementsprechend sind auch für die betriebsspezifische Betreuung keine festen Einsatzzeiten vorgeschrieben, können aber im Bedarfsfall vereinbart werden.
    </p>`,
};


export const NOTES_CONTENT: any = {
    SIFA: `<p>Hierin enthalten sind alle Nebenkosten wie Anfahrt und Übernachtung, zzgl. der am Tage der Rechnungslegung gültigen Mehrwertsteuer.</p>
<p>Eine externe Fachbetreuung im Brandschutz können wir Ihnen zusätzlich anbieten. Dies müsste extern beauftragt werden. Gern unterbreiten wir Ihnen ein entsprechendes Angebot. Weiterhin können wir Ihnen folgende Leistungen anbieten:</p>
<ul>
<li>die Ausbildung von Mitarbeitern zum Sicherheitsbeauftragten</li>
<li>die Ausbildung von Mitarbeitern zum Brandschutzhelfer</li>
<li>Ausbildung zum Führer von Flurförderzeugen und Kranführer</li>
<li>Die Prüfung ortsveränderlicher elektrischer Betriebsmittel</li>
<li>Die Prüfung von Leitern und Regalen</li>
<li>Ausbildung zum Befähigten zur Prüfung von Leitern und Regalen</li>
</ul>
<p>Wir gehen davon aus, Ihnen ein Ihren Vorstellungen entsprechendes Angebot unterbreitet zu haben und würden uns über die Auftragserteilung über zwei Jahre freuen.</p>
<p>Wir hoffen, Ihnen für eine positive Entscheidung geholfen zu haben. </p>
<p>Mit freundlichem Grüßen</p><p>Lars Guido Schlegel</p>`,
    QM: `<p>vielen Dank für Ihre Anfrage nach einem Angebot. </p>`,
    SiGeKo: `<p>vielen Dank für Ihre Anfrage nach einem Angebot. </p>`,
};

export const PDF_TEMPLATE: any = {
    header: {
        columns: [
            '',
            {
                image: 'data:image/png;base64,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', alignment: 'right',
                width: 80
            }
        ],
        style: 'header'
    },
    content: [

    ],
    styles: {
        header: {
            margin: [20, 5, 20, 20]
        },
        subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5]
        },
        tableExample: {
            margin: [0, 5, 0, 15]
        },
        tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
        }
    },
    defaultStyle: {
        fontSize: 12
    }
}

export const SERVICE_TABLE: any = {
    time: {
        style: 'tableExample',
        table: {
            widths: [100, 200, '*', '*', '*'],
            body: [
                [
                    { text: 'Name', bold: true, fillColor: '#3498eb' },
                    { text: 'Description', bold: true, fillColor: '#3498eb' },
                    { text: 'Rate', bold: true, fillColor: '#3498eb' },
                    { text: 'Quantity', bold: true, fillColor: '#3498eb' },
                    { text: 'Total', bold: true, fillColor: '#3498eb' }
                ],
            ]
        }
    },
    fixed: {
        style: 'tableExample',
        table: {
            widths: [100, 300, '*'],
            body: [
                [
                    { text: 'Name', bold: true, fillColor: '#3498eb' },
                    { text: 'Description', bold: true, fillColor: '#3498eb' },
                    { text: 'Total', bold: true, fillColor: '#3498eb' }
                ],
            ]
        }
    },
    alacarte: {
        style: 'tableExample',
        table: {
            widths: [100, 300, '*'],
            body: [
                [
                    { text: 'Name', bold: true, fillColor: '#3498eb' },
                    { text: 'Description', bold: true, fillColor: '#3498eb' },
                    { text: 'Rate', bold: true, fillColor: '#3498eb' }
                ]
            ]
        }
    }
}
export const addQuoteContent = (quote: any, basePDFTEMPLATE: any) => {
    const serviceContent = SERVICE_TABLE[quote.type];
    // Resetting the service table body 
    if(serviceContent.table.body.length > 1) {  serviceContent.table.body.splice(1, serviceContent.table.body.length); }
    
    _.each(quote.services, (service: any) => {
        switch (quote.type) {
            case 'time':
                serviceContent.table.body.push([service.service.subtype, service.description, `${service.unitRate} ${(service.service.measure == 'Daily') ? '/ day' : '/ hr'}`, service.quantity, service.total]);
                break;
            case 'fixed':
                serviceContent.table.body.push([service.service.subtype, service.description, service.total]);
                break;
            case 'alacarte':
                serviceContent.table.body.push([service.service.subtype, service.description, `${service.unitRate} ${(service.service.measure == 'Daily') ? '/ day' : '/ hr'}`]);
                break;
        }
    });
    basePDFTEMPLATE.content.push(serviceContent);
    basePDFTEMPLATE.content.push({ text: `Total : ${quote.subTotal} €`, bold: true, margin: [10, 10, 0, 0], alignment: 'right' });
}