import { Document, Font, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { ReactNode } from "react";
import { courtHelpCenter, dhcdRentalLicensingUrl, marylandLegalAid, publicJusticeCenter } from "@/lib/contacts";
import {
  formatDate,
  formatTime,
  getAdvocateCase,
  getCaseDetail,
  licenseResultBadge,
  type AdvocateCase,
} from "@/lib/mock/advocate";
import { courtChecklist, dhcdOffice, licenseRecords, resultsCase } from "@/lib/mock/results";
import { lookupAddress } from "@/lib/mock/scan";

/*
 * Downloadable PDFs, served by /api/cases/[caseId]/report?type=…
 *   summary    tenant license-check summary (results page; `&result=unverified` for guided check)
 *   checklist  tenant court-preparation checklist
 *   case       advocate case export
 * Colors are the hex values of the design tokens in globals.css (PDFs can't read CSS variables).
 */

export type ReportType = "summary" | "checklist" | "case";

// Keep words whole: the default hyphenation splits names and case numbers.
Font.registerHyphenationCallback((word) => [word]);

const color = {
  text: "#0f172a",
  secondary: "#475569",
  tertiary: "#64748b",
  border: "#e2e8f0",
  borderStrong: "#cbd5e1",
  subtle: "#f1f5f9",
  accent: "#1d4ed8",
  accentSubtle: "#eff6ff",
  successFg: "#15803d",
  successBg: "#f0fdf4",
  successBorder: "#bbf7d0",
  warningFg: "#b45309",
  warningBg: "#fffbeb",
  warningBorder: "#fde68a",
  dangerFg: "#b91c1c",
};

const s = StyleSheet.create({
  page: { paddingTop: 44, paddingBottom: 64, paddingHorizontal: 48, fontFamily: "Helvetica", fontSize: 10, color: color.text, lineHeight: 1.45 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: color.border, marginBottom: 20 },
  brand: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 20, height: 20, borderRadius: 4, backgroundColor: color.accent, color: "#ffffff", fontFamily: "Helvetica-Bold", fontSize: 11, textAlign: "center", paddingTop: 4 },
  brandName: { fontFamily: "Helvetica-Bold", fontSize: 12 },
  headerMeta: { fontSize: 9, color: color.tertiary, textAlign: "right" },
  eyebrow: { fontSize: 9, color: color.tertiary, fontFamily: "Courier", marginBottom: 4 },
  title: { fontFamily: "Helvetica-Bold", fontSize: 18, lineHeight: 1.25, marginBottom: 4 },
  subtitle: { fontSize: 10.5, color: color.secondary, marginBottom: 16 },
  callout: { borderWidth: 1, borderRadius: 6, padding: 12, marginBottom: 16 },
  calloutTitle: { fontFamily: "Helvetica-Bold", fontSize: 12, marginBottom: 3 },
  section: { marginBottom: 16 },
  sectionTitle: { fontFamily: "Helvetica-Bold", fontSize: 11, marginBottom: 8 },
  box: { borderWidth: 1, borderColor: color.border, borderRadius: 6 },
  row: { flexDirection: "row", paddingVertical: 5.5, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: color.border },
  rowLast: { borderBottomWidth: 0 },
  label: { width: 140, color: color.secondary },
  value: { flex: 1, fontFamily: "Helvetica-Bold" },
  th: { fontSize: 8.5, color: color.tertiary, fontFamily: "Helvetica-Bold" },
  mono: { fontFamily: "Courier" },
  muted: { color: color.tertiary, fontSize: 9 },
  bullet: { flexDirection: "row", gap: 8, marginBottom: 6 },
  num: { width: 16, height: 16, borderRadius: 8, backgroundColor: color.accentSubtle, alignItems: "center", justifyContent: "center" },
  numText: { color: color.accent, fontFamily: "Helvetica-Bold", fontSize: 8.5, lineHeight: 1 },
  tag: { alignSelf: "flex-start", fontSize: 8, lineHeight: 1, fontFamily: "Helvetica-Bold", paddingTop: 3, paddingBottom: 2, paddingHorizontal: 5, borderRadius: 3, borderWidth: 1 },
  quote: { borderLeftWidth: 3, borderLeftColor: color.accent, paddingLeft: 10, paddingVertical: 2, fontSize: 11 },
  footer: { position: "absolute", bottom: 28, left: 48, right: 48, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: color.tertiary, borderTopWidth: 1, borderTopColor: color.border, paddingTop: 8 },
});

/* ------------------------------------------------------------------------------------------------ */

function Shell({ title, reference, children }: { title: string; reference: string; children: ReactNode }) {
  return (
    <Document title={`${title} · ${reference}`} author="Standing" creator="Standing">
      <Page size="LETTER" style={s.page}>
        <View style={s.header} fixed>
          <View style={s.brand}>
            <Text style={s.logo}>S</Text>
            <Text style={s.brandName}>Standing</Text>
          </View>
          <Text style={s.headerMeta}>
            {title}
            {"\n"}
            <Text style={s.mono}>{reference}</Text>
          </Text>
        </View>
        {/* The right side of the footer ("Standing · ref · Page X of Y") is stamped by addPageNumbers:
            react-pdf's `render` prop draws nothing on a page with a lineHeight. */}
        <View style={s.footer} fixed>
          <Text>Informational only. Not legal advice.</Text>
        </View>
        {children}
      </Page>
    </Document>
  );
}

/** `keepTogether` moves the whole section to the next page instead of splitting it (for short tables). */
function Section({ title, children, keepTogether = false }: { title: string; children: ReactNode; keepTogether?: boolean }) {
  return (
    <View style={s.section} wrap={!keepTogether}>
      <Text style={s.sectionTitle} minPresenceAhead={48}>
        {title}
      </Text>
      {children}
    </View>
  );
}

/** Short label/value tables stay on one page. */
function KeyValues({ rows }: { rows: [string, string][] }) {
  return (
    <View style={s.box} wrap={false}>
      {rows.map(([label, value], i) => (
        <View key={label} style={[s.row, i === rows.length - 1 ? s.rowLast : {}]} wrap={false}>
          <Text style={s.label}>{label}</Text>
          <Text style={s.value}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

type Column = { header: string; width: number | string; mono?: boolean };

function Table({ columns, rows }: { columns: Column[]; rows: string[][] }) {
  return (
    <View style={s.box}>
      <View style={[s.row, { backgroundColor: "#f8fafc" }]}>
        {columns.map((c) => (
          <Text key={c.header} style={[s.th, { width: c.width }]}>
            {c.header}
          </Text>
        ))}
      </View>
      {rows.map((cells, r) => (
        <View key={r} style={[s.row, r === rows.length - 1 ? s.rowLast : {}]} wrap={false}>
          {cells.map((cell, i) => (
            <Text key={i} style={[{ width: columns[i].width }, columns[i].mono ? s.mono : {}]}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function Callout({ tone, title, children }: { tone: "success" | "warning"; title: string; children: ReactNode }) {
  const t = tone === "success"
    ? { borderColor: color.successBorder, backgroundColor: color.successBg, fg: color.successFg }
    : { borderColor: color.warningBorder, backgroundColor: color.warningBg, fg: color.warningFg };
  return (
    <View style={[s.callout, { borderColor: t.borderColor, backgroundColor: t.backgroundColor }]}>
      <Text style={[s.calloutTitle, { color: t.fg }]}>{title}</Text>
      <Text style={{ color: color.text }}>{children}</Text>
    </View>
  );
}

type Tag = "required" | "optional";

function TagLabel({ tag }: { tag: Tag }) {
  return tag === "required" ? (
    <Text style={[s.tag, { color: color.dangerFg, borderColor: "#fecaca", backgroundColor: "#fef2f2" }]}>Required</Text>
  ) : (
    <Text style={[s.tag, { color: color.secondary, borderColor: color.borderStrong, backgroundColor: color.subtle }]}>Optional</Text>
  );
}

function Numbered({ items }: { items: { title: string; detail?: string; tag?: Tag }[] }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={item.title} style={s.bullet} wrap={false}>
          <View style={s.num}>
            <Text style={s.numText}>{i + 1}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>{item.title}</Text>
            {item.detail && <Text style={{ color: color.secondary }}>{item.detail}</Text>}
          </View>
          {item.tag && <TagLabel tag={item.tag} />}
        </View>
      ))}
    </View>
  );
}

function Contacts() {
  return (
    <Section title="Free legal help" keepTogether>
      <KeyValues
        rows={[
          [marylandLegalAid.name, marylandLegalAid.phone],
          [publicJusticeCenter.name, publicJusticeCenter.phone],
          [courtHelpCenter.name, `${courtHelpCenter.phone} · Mon–Fri 8:30 a.m.–8:00 p.m.`],
        ]}
      />
    </Section>
  );
}

function caseRows(): [string, string][] {
  const c = resultsCase;
  return [
    ["Property", `${c.street}, ${c.cityLine}`],
    ["Landlord (plaintiff)", c.landlordName],
    ["Case number", c.caseNumber],
    ["Court", c.court],
    ["Filed", c.filingDate],
    ["Hearing", `${c.hearing.dateTime} · ${c.hearing.arrive}`],
  ];
}

/* ------------------------------------------------------------------------------------------------ */

function TenantSummary({ unverified }: { unverified: boolean }) {
  const c = resultsCase;
  return (
    <Shell title="License check summary" reference={c.reference}>
      <Text style={s.eyebrow}>Checked {c.checkedAt}</Text>
      <Text style={s.title}>{unverified ? "We couldn’t verify the rental license" : "No active rental license found"}</Text>
      <Text style={s.subtitle}>{c.street} · Hearing {c.hearing.dateTime}</Text>

      {unverified ? (
        <Callout tone="warning" title="This is not a negative result">
          Baltimore City DHCD records did not respond. Check the license yourself on the city’s website, or ask
          DHCD for an official certification.
        </Callout>
      ) : (
        <Callout tone="success" title="Possible defense">
          DHCD records show no active license on the filing date ({c.filingDate}). The landlord may not be
          permitted to pursue this case.
        </Callout>
      )}

      <Section title="Case details" keepTogether>
        <KeyValues rows={caseRows()} />
      </Section>

      {unverified ? (
        <Section title="Check it yourself">
          <Numbered
            items={[
              { title: `Search for ${lookupAddress}`, detail: "Street number and name only. Leave out the apartment number." },
              { title: "Open the Baltimore City rental license lookup", detail: dhcdRentalLicensingUrl },
              { title: "Note whether an active license shows for the filing date", detail: c.filingDate },
            ]}
          />
        </Section>
      ) : (
        <Section title="License records">
          <Table
            columns={[
              { header: "License #", width: "26%", mono: true },
              { header: "Status", width: "14%" },
              { header: "Valid from", width: "18%" },
              { header: "Valid to", width: "18%" },
              { header: "Source", width: "24%" },
            ]}
            rows={licenseRecords.map((r) => [r.number, r.status === "active" ? "Active" : "Expired", r.validFrom, r.validTo, r.source])}
          />
        </Section>
      )}

      <Section title="Next steps">
        <Numbered
          items={[
            { title: "Request an official DHCD certification", detail: `${dhcdOffice.name}, ${dhcdOffice.fullAddress}. Courts need it as evidence.` },
            { title: "Prepare your court documents", detail: "Summons, photo ID, lease, rent payment records, and the certification or its request receipt." },
            { title: "Get free legal help", detail: "Volunteer attorneys are at the courthouse during morning rent court dockets." },
          ]}
        />
      </Section>

      <Contacts />
    </Shell>
  );
}

/** The checklist items phrased as things to do. */
const checklistTodo: Record<string, string> = {
  summons: "Bring your summons and complaint",
  certification: "Get your DHCD certification, or the receipt for requesting it",
  "photo-id": "Bring a photo ID",
  lease: "Bring your lease agreement",
  "rent-records": "Gather your rent payment records",
  repairs: "Collect repair photos or messages",
};

function CourtChecklist() {
  const c = resultsCase;
  return (
    <Shell title="Court preparation checklist" reference={c.reference}>
      <Text style={s.title}>Court preparation</Text>
      <Text style={s.subtitle}>Things to do before and on the day of your hearing.</Text>

      <Section title="Your hearing" keepTogether>
        <KeyValues
          rows={[
            ["When", `${c.hearing.dateTime} · ${c.hearing.arrive}`],
            ["Where", c.hearing.courtName],
            ["Case number", c.caseNumber],
            ["Property", c.street],
          ]}
        />
      </Section>

      <Section title="Before your hearing">
        <Numbered items={courtChecklist.map((item) => ({ title: checklistTodo[item.id] ?? item.label, tag: item.tag }))} />
      </Section>

      <Section title="On the day">
        <Numbered
          items={[
            { title: `Arrive by 8:30 AM at ${c.hearing.courtName}`, detail: `Your hearing starts at 9:00 AM. Case ${c.caseNumber}.` },
            { title: "Ask for the Tenant Volunteer Lawyer of the Day", detail: "Free volunteer attorneys are at the courthouse during morning rent court dockets." },
          ]}
        />
      </Section>

      <Section title="What to say to the attorney">
        <Text style={s.quote}>“My landlord doesn’t have an active rental license. Can you help me raise that defense?”</Text>
      </Section>

      <Contacts />
    </Shell>
  );
}

function AdvocateCaseExport({ c }: { c: AdvocateCase }) {
  const detail = getCaseDetail(c);
  const result = licenseResultBadge[c.licenseResult];
  return (
    <Shell title="Case export" reference={c.reference}>
      <Text style={s.eyebrow}>{c.reference} · {result.label}</Text>
      <Text style={s.title}>{c.propertyAddress}</Text>
      <Text style={s.subtitle}>
        {c.landlordName} v. Tenant · Case {c.caseNumber}
      </Text>

      <Callout tone={detail.result.tone === "ok" ? "success" : "warning"} title="License verification">
        {detail.result.text}
      </Callout>

      <Section title="License records">
        {detail.records.length ? (
          <Table
            columns={[
              { header: "License #", width: "26%", mono: true },
              { header: "Status", width: "14%" },
              { header: "Valid from", width: "18%" },
              { header: "Valid to", width: "18%" },
              { header: "Source", width: "24%" },
            ]}
            rows={detail.records.map((r) => [r.number, r.status, r.validFrom, r.validTo, r.source])}
          />
        ) : (
          <Text style={s.muted}>No license records found.</Text>
        )}
        <Text style={[s.muted, { marginTop: 6 }]}>
          {detail.lookupMeta.checked} · {detail.lookupMeta.source} · {detail.lookupMeta.match}
        </Text>
      </Section>

      <Section title="Summons details" keepTogether>
        <KeyValues
          rows={[
            ["Case number", c.caseNumber],
            ["Court", c.court],
            ["Plaintiff", c.landlordName],
            ["Filed", formatDate(c.filingDate, "long")],
            ["Hearing", `${formatDate(c.hearingDate, "long")} · ${formatTime(c.hearingDate)}`],
            ["License # on complaint", c.licenseNumberOnComplaint ?? "Not listed"],
            ["Assignee", c.assignee ?? "Unassigned"],
          ]}
        />
      </Section>

      <Section title="Next actions">
        <Table
          columns={[
            { header: "Action", width: "60%" },
            { header: "Status", width: "20%" },
            { header: "Due", width: "20%" },
          ]}
          rows={detail.nextActions.map((a) => [a.label, a.done ? "Done" : "Open", a.due])}
        />
      </Section>

      <Section title="Activity">
        <Table
          columns={[
            { header: "Event", width: "65%" },
            { header: "By · when", width: "35%" },
          ]}
          rows={detail.activity.map((e) => [e.title, e.meta])}
        />
      </Section>
    </Shell>
  );
}

/* ------------------------------------------------------------------------------------------------ */

const FOOTER_BASELINE = 35; // points from the bottom, level with the footer's left text
const MARGIN_X = 48;

/** Stamps "Standing · ref · Page X of Y" on the right of each page's footer. */
async function addPageNumbers(pdf: Buffer, reference: string) {
  const doc = await PDFDocument.load(pdf);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const pages = doc.getPages();
  pages.forEach((page, i) => {
    const text = `Standing · ${reference} · Page ${i + 1} of ${pages.length}`;
    const size = 8;
    page.drawText(text, {
      x: page.getWidth() - MARGIN_X - font.widthOfTextAtSize(text, size),
      y: FOOTER_BASELINE,
      size,
      font,
      color: rgb(0x64 / 255, 0x74 / 255, 0x8b / 255), // text/tertiary
    });
  });
  return Buffer.from(await doc.save());
}

async function render(element: React.ReactElement<React.ComponentProps<typeof Document>>, reference: string) {
  return addPageNumbers(await renderToBuffer(element), reference);
}

/** Renders a report, or returns null when the case or type is unknown. */
export async function renderCaseReport(caseId: string, type: string, options: { unverified?: boolean } = {}) {
  if (type === "case") {
    const c = getAdvocateCase(caseId);
    if (!c) return null;
    return { buffer: await render(<AdvocateCaseExport c={c} />, c.reference), filename: `standing-case-${c.reference}.pdf` };
  }
  // The tenant flow only has the one mock case so far.
  if (caseId !== resultsCase.reference) return null;
  if (type === "summary") {
    return {
      buffer: await render(<TenantSummary unverified={Boolean(options.unverified)} />, caseId),
      filename: `standing-summary-${caseId}.pdf`,
    };
  }
  if (type === "checklist") {
    return { buffer: await render(<CourtChecklist />, caseId), filename: `standing-court-checklist-${caseId}.pdf` };
  }
  return null;
}
