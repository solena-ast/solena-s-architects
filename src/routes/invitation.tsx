import { createFileRoute } from "@tanstack/react-router";

import { PageShell } from "@/components/page-shell";
import invitationVid from "@/assets/video_1782033207805.mp4.asset.json";
import poster from "@/assets/g-01.1-potrait.png.asset.json";

export const Route = createFileRoute("/invitation")({
  head: () => ({
    meta: [
      { title: "SOLENA — Invitation" },
      { name: "description", content: "Access is not open. It is aligned." },
    ],
  }),
  component: InvitationPage,
});

function InvitationPage() {
  return (
    <PageShell
      eyebrow="07 / Invitation"
      title="Access is not open. It is aligned."
      backdrop={{ kind: "video", landscape: invitationVid.url, poster: poster.url }}
    >
      <section className="solena-section invitation-section">
        <div className="section-shell section-shell-narrow invitation-shell">
          <div className="invitation-copy reveal-delayed">
            <p>We work with those building beyond cycles.</p>
            <p>Founders. Institutions. Architects. Investors. Cultural builders.</p>
          </div>
          <div className="hero-actions reveal-slower">
            <a href="mailto:access@solena.world?subject=Request%20Access" className="solena-button">
              <span>Request Access</span>
              <small>Signal alignment</small>
            </a>
          </div>
          <p className="micro-copy reveal-slower">Not everyone will be reviewed.</p>
          <p className="invitation-final reveal-slower">
            If Solena is relevant to your trajectory, you will know before we respond.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
