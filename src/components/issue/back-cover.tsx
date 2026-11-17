import { profile } from "@/content";

// The back cover: the résumé as an old mail-order ad, played straight.
export function BackCover() {
  return (
    <section id="back-cover" className="panel back-cover" aria-labelledby="back-cover-heading">
      <div className="ad">
        <h2 id="back-cover-heading">Send no money<i>!</i><br />Get the full file</h2>
        <p>One page: every job, every merged PR, every win, with links.</p>
        <ul>
          <li>{profile.role}</li>
          <li>{profile.availability}</li>
          <li>{profile.location} · overlaps US hours</li>
        </ul>
      </div>
      <div className="coupon">
        <span className="scissor" aria-hidden="true">✂</span>
        <p className="coupon-head">Rush me the résumé of {profile.name}</p>
        <p className="coupon-row"><a className="comic-btn" href="/resume">Read the résumé <span aria-hidden="true">→</span></a></p>
        <p className="coupon-small">Or write in: <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
      </div>
    </section>
  );
}
