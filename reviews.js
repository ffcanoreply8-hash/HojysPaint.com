/* Hojy's customer reviews. Load after script.js; no other files need replacing. */
(() => {
  'use strict';
  function init() {
    const section = document.getElementById('reviews');
    if (!section || section.dataset.reviewsReady) return;
    section.dataset.reviewsReady = 'true';
    const endpoint = 'https://dnjuchgkokcuyxipysic.supabase.co/rest/v1/reviews';
    const apiKey = 'sb_publishable_KnoZ34yXgujqcWfAEe8VJw_a4j2oOEK';
    const style = document.createElement('style');
    style.textContent = `
      #reviews .hr-layout{display:grid;grid-template-columns:1.1fr 1fr;gap:36px;align-items:start}
      #reviews .hr-form,#reviews .hr-card{background:var(--cream,#fffdf8);border:1px solid var(--line,#d8ded8);padding:28px}
      #reviews .hr-form{display:grid;gap:18px;min-width:0}
      #reviews h3{margin:0;font:600 1.65rem var(--serif,Georgia)}
      #reviews .hr-form label{display:grid;gap:7px;font-size:.9rem;font-weight:600}
      #reviews .hr-form input:not([type=checkbox]),#reviews select,#reviews textarea{width:100%;box-sizing:border-box;border:1px solid var(--line,#cbd3ce);background:#fff;color:var(--navy,#102331);padding:12px;font:inherit;border-radius:0}
      #reviews textarea{resize:vertical;min-height:140px}
      #reviews .hr-help{margin:0;color:var(--muted,#6b7b82);font-size:.85rem}
      #reviews .hr-consent{display:flex!important;align-items:flex-start;gap:10px!important;font-weight:400!important}
      #reviews .hr-consent input{width:18px;height:18px;flex:none;margin-top:4px;accent-color:var(--green2,#34752d)}
      #reviews .hr-list{display:grid;gap:18px;margin:18px 0}
      #reviews .hr-card{overflow-wrap:anywhere}
      #reviews .hr-card p{white-space:pre-wrap;margin:16px 0;color:var(--ink,#314853)}
      #reviews .hr-meta{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;font-size:.85rem;color:var(--muted,#6b7b82)}
      #reviews .hr-stars{color:var(--green2,#34752d);letter-spacing:3px;font-size:1.2rem}
      #reviews .hr-toolbar{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
      #reviews .hr-refresh{padding:8px 14px;border:1px solid var(--line,#cbd3ce);background:transparent;cursor:pointer;font:inherit;font-size:.85rem}
      #reviews button:disabled{opacity:.6;cursor:wait}
      #reviews .hr-status{margin:0;font-size:.9rem;overflow-wrap:anywhere}
      #reviews .hr-status[data-kind=error]{color:#852323}
      #reviews .hr-status[data-kind=success]{color:var(--green2,#34752d)}
      #reviews .hr-trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
      @media(max-width:800px){#reviews .hr-layout{grid-template-columns:1fr}#reviews .hr-form,#reviews .hr-card{padding:22px}}
    `;
    document.head.append(style);
    section.innerHTML = `
      <div class="container">
        <header class="section-heading"><div><p class="eyebrow">Customer feedback</p><h2>Your experience <em>matters.</em></h2></div><p>Worked with Hojy's? Share an honest review of your experience. Reviews are checked before appearing here.</p></header>
        <div class="hr-layout">
          <div><div class="hr-toolbar"><h3>Customer reviews</h3><button class="hr-refresh" type="button">Refresh reviews</button></div>
            <p class="hr-help">Customer-submitted feedback. Reviews are not independently verified.</p>
            <p class="hr-load-status hr-status" role="status" aria-live="polite"></p>
            <div class="hr-list"></div>
            <button class="hr-more hr-refresh" type="button" hidden>Load more reviews</button>
          </div>
          <form class="hr-form">
            <h3>Leave a review</h3>
            <p class="hr-help">Your display name, rating and review will be public once approved. Please leave out private contact or address details.</p>
            <label for="hr-name">Display name<input id="hr-name" name="name" autocomplete="nickname" required minlength="2" maxlength="80" placeholder="e.g. Sarah M."></label>
            <label for="hr-rating">Your rating<select id="hr-rating" name="rating" required><option value="">Choose a rating</option><option value="5">5 stars — Excellent</option><option value="4">4 stars — Good</option><option value="3">3 stars — Average</option><option value="2">2 stars — Below expectations</option><option value="1">1 star — Poor</option></select></label>
            <label for="hr-review">Your review<textarea id="hr-review" name="review" rows="5" required minlength="10" maxlength="2000" placeholder="Tell us about the service and your experience…"></textarea></label>
            <label class="hr-consent"><input type="checkbox" name="consent" required><span>I used Hojy's services and agree to my display name, rating and review being published. <a href="#privacy">Privacy information</a>.</span></label>
            <div class="hr-trap" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>
            <button class="button primary" type="submit">Submit my review <span aria-hidden="true">↗</span></button>
            <p class="hr-submit-status hr-status" role="status" aria-live="polite"></p>
            <p class="hr-help">Reviews are stored with Supabase and reviewed by Hojy's before publication.</p>
          </form>
        </div>
      </div>`;
    const privacy = document.querySelector('#privacy .container');
    if (privacy && !document.getElementById('hr-privacy')) {
      const notice = document.createElement('p');
      notice.id = 'hr-privacy';
      notice.textContent = "Customer reviews: your display name, rating and review are stored using Supabase. Submitted reviews are available to Hojy's for moderation; approved reviews are published on this website. Do not include private information. To request removal, email m.zadehhojy@yahoo.com with the review details.";
      privacy.append(notice);
    }
    const find = s => section.querySelector(s);
    const list = find('.hr-list');
    const loadStatus = find('.hr-load-status');
    const more = find('.hr-more');
    const refresh = find('.hr-refresh');
    const form = find('form');
    const submit = find('button[type=submit]');
    const status = find('.hr-submit-status');
    const pageSize = 12;
    let offset = 0, loading = false, submitting = false;
    async function request(url, options = {}) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(url, {...options, signal: controller.signal, headers: {apikey: apiKey, ...options.headers}});
        if (!response.ok) throw new Error('Review service returned ' + response.status);
        return response;
      } finally { clearTimeout(timeout); }
    }
    function renderCard(review) {
      const card = document.createElement('article');
      card.className = 'hr-card';
      const stars = document.createElement('div');
      stars.className = 'hr-stars';
      const rating = Math.max(1, Math.min(5, Number(review.rating) || 1));
      stars.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
      stars.setAttribute('aria-label', rating + ' out of 5 stars');
      const text = document.createElement('p');
      text.textContent = review.review;
      const meta = document.createElement('div');
      meta.className = 'hr-meta';
      const name = document.createElement('strong');
      name.textContent = review.name;
      const date = document.createElement('time');
      const parsed = new Date(review.created_at);
      if (!Number.isNaN(parsed.getTime())) {
        date.dateTime = parsed.toISOString();
        date.textContent = new Intl.DateTimeFormat('en-CA', {year:'numeric',month:'short',day:'numeric',timeZone:'America/Edmonton'}).format(parsed);
      }
      meta.append(name, date);
      card.append(stars, text, meta);
      return card;
    }
    async function load(reset = false) {
      if (loading) return;
      loading = true;
      refresh.disabled = more.disabled = true;
      loadStatus.textContent = 'Loading reviews…';
      loadStatus.dataset.kind = '';
      const nextOffset = reset ? 0 : offset;
      try {
        const query = new URLSearchParams({select:'id,name,rating,review,created_at',approved:'eq.true',order:'created_at.desc,id.desc',limit:String(pageSize + 1),offset:String(nextOffset)});
        const response = await request(endpoint + '?' + query, {cache:'no-store'});
        const rows = await response.json();
        if (!Array.isArray(rows)) throw new Error('Unexpected reviews response');
        if (reset) list.replaceChildren();
        rows.slice(0, pageSize).forEach(row => list.append(renderCard(row)));
        offset = nextOffset + Math.min(rows.length, pageSize);
        more.hidden = rows.length <= pageSize;
        loadStatus.textContent = offset ? '' : 'No published reviews yet. Be the first to share your experience.';
      } catch (_) {
        loadStatus.dataset.kind = 'error';
        loadStatus.textContent = 'Reviews could not be loaded. Please try Refresh reviews.';
      } finally { loading = false; refresh.disabled = more.disabled = false; }
    }
    refresh.addEventListener('click', () => load(true));
    more.addEventListener('click', () => load());
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (submitting || !form.reportValidity()) return;
      const data = new FormData(form);
      if (data.get('website')) return;
      const name = String(data.get('name') || '').trim();
      const review = String(data.get('review') || '').trim();
      if (name.length < 2 || review.length < 10) {
        status.dataset.kind = 'error';
        status.textContent = 'Please enter a name with at least 2 characters and a review with at least 10 characters, excluding spaces at the start and end.';
        return;
      }
      submitting = true;
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      status.dataset.kind = '';
      status.textContent = 'Submitting your review…';
      try {
        await request(endpoint, {method:'POST',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({name,rating:Number(data.get('rating')),review})});
        form.reset();
        status.dataset.kind = 'success';
        status.textContent = 'Thank you! Your review was received and is awaiting approval. It will appear here once approved.';
      } catch (_) {
        status.dataset.kind = 'error';
        status.textContent = 'We could not confirm your submission. Your text has been kept. Please try again later, or email m.zadehhojy@yahoo.com. If you retry, it may create a duplicate if the first request arrived.';
      } finally {
        submitting = false;
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
      }
    });
    load(true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
