import { mailbag, profile } from "@/content";
import { CopyText, Doodle, LetterBooking } from "@/components/issue/letter-booking";

// The letters column: likely questions answered by "ED:", and booking written as a letter.
export function Letters() {
  return (
    <section id="letters" className="panel lt" aria-labelledby="letters-heading">
      <header className="lt-mast">
        <span className="lt-flag">Prxmy Post</span>
        <h2 id="letters-heading">Letters<i>.</i></h2>
        <p className="meta">Questions answered,<br />calls booked</p>
      </header>
      <div className="lt-grid">
        <div className="mailbag">
          <p className="colhead"><b>The Mailbag</b><span>Answered before you ask</span></p>
          {mailbag.map((letter) => (
            <article key={letter.q} className="ltr">
              <h3 className="q">{letter.q}</h3>
              <p className="sig">— {letter.from}</p>
              <p className="a"><b>ED:</b> {letter.a}{letter.link && <> <a href={letter.link.href}>{letter.link.label} →</a></>}</p>
            </article>
          ))}
          <article className="ltr">
            <h3 className="q">I’d rather just email.</h3>
            <p className="sig">— Everyone, sometimes</p>
            <div className="a"><b>ED:</b> Fair. Here it is:
              <p className="mailrow"><a href={`mailto:${profile.email}`}><code>{profile.email}</code></a><CopyText text={profile.email} /></p>
            </div>
          </article>
          <Doodle />
        </div>
        <div className="letter-col"><LetterBooking /></div>
      </div>
    </section>
  );
}
