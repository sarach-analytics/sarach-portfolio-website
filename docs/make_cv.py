"""Build Sarach's CV (one page, A4) from HTML with PyMuPDF's Story API."""
import sys

import pymupdf

out = sys.argv[1]

HTML = """
<div class="name">SARACH SRIKLAB</div>
<div class="headline">Analytics Engineer</div>
<div class="contact">sarach.srik@gmail.com &nbsp;|&nbsp; sarach-analytics.github.io/sarach-portfolio-website &nbsp;|&nbsp; linkedin.com/in/sarach-sriklab-b1669715a &nbsp;|&nbsp; Bangkok, Thailand</div>

<h2>Profile</h2>
<p>Analytics engineer with 5+ years in data who builds the metrics and tested data models a business reports from, and turns them into decisions. Experienced across
supply chain, digital analytics, hospitality and a modern data stack (dbt, Redshift, Evidence). Works alongside AI for drafting SQL,
tests and documentation, with every result human-reviewed. Founder of NorthBear, a data and AI education and consulting brand.</p>

<h2>Experience</h2>
<table><tr><td class="role">Data Analyst (analytics engineering scope), <b>Juzmatch</b></td><td class="when">Jul 2026 – Present</td></tr></table>
<ul>
<li>Define and document business KPIs with stakeholders to create a single source of truth.</li>
<li>Move report logic into a shared dbt project on Redshift (data landed in S3); build reports as code in Evidence, version-controlled in git.</li>
<li>Monitor data quality, maintain the data dictionary, and train business users on self-service reporting.</li>
<li>Deliver ad-hoc analysis that ends in a recommendation, not only a report.</li>
</ul>

<table><tr><td class="role">Business Intelligence Analyst, <b>Minor Hotels</b></td><td class="when">Feb 2024 – Jun 2026</td></tr></table>
<ul>
<li>Consolidated Europe, Australia and Thailand data into one performance dashboard for a group of 500+ hotels.</li>
<li>Designed performance tracking against budget and forecast, with a watchlist and revenue breakdown for underperforming hotels.</li>
<li>Integrated STR competitor data for benchmarking; made dashboards load 30% faster through SQL optimisation.</li>
<li>Contributed to the AWS to GCP data lake migration (medallion architecture, Airflow, dbt).</li>
</ul>

<table><tr><td class="role">Data Analyst, <b>Predictive</b></td><td class="when">Jul 2022 – Aug 2023</td></tr></table>
<ul>
<li>Raised an e-commerce client's GA4 data accuracy from 80% to 100% by aligning it with backend data.</li>
<li>Analysed website, campaign and user-experience data for e-commerce, banking, real estate and insurance clients.</li>
</ul>

<table><tr><td class="role">Data Analyst, <b>DHL Supply Chain</b></td><td class="when">Oct 2021 – Jun 2022</td></tr></table>
<ul>
<li>Built an operational reporting system that raised raw data accuracy from 60% to 90%.</li>
<li>Designed Power BI dashboards to support the audit team; assessed vessel performance with carrier managers to reduce customer costs.</li>
<li>Led the team in using Oracle Transportation Management (OTM).</li>
</ul>

<table><tr><td class="role">Industrial Engineer (Internship), <b>DENSO</b></td><td class="when">Jun – Jul 2019</td></tr></table>
<ul>
<li>Led a Lean Automation (LASI) team that automated manual tasks: 37.5% shorter assembly lead time, 3.6% lower manpower cost.</li>
</ul>

<h2>Selected projects</h2>
<ul>
<li><b>Echo (NorthBear)</b>: AI data agent that turns a spreadsheet into a morning recap with a written brief, answers follow-up questions, and cites the source rows for every answer.</li>
<li><b>Real-time stock data pipeline</b>: Kafka, Airflow, dbt and Snowflake feeding a live dashboard (code on GitHub).</li>
</ul>

<h2>Skills</h2>
<p><b>Analytics engineering:</b> KPI definition, dbt models with data tests and docs, dimensional modelling (star schema), data storytelling, dashboard design, stakeholder management, self-service enablement<br>
<b>Working with AI:</b> AI data agents, AI-assisted SQL/tests/documentation with human review, answer guardrails (cite or say "I don't know")<br>
<b>Tools:</b> SQL, dbt, Redshift, S3, Evidence, git, Python (pandas), Power BI (DAX), Tableau, Airflow, Athena/Presto, GCP, GA4, Google Tag Manager</p>

<h2>Education</h2>
<table><tr><td class="role">M.Eng., Logistics and Supply Chain Systems Engineering, <b>SIIT, Thammasat University</b></td><td class="when">2022</td></tr>
<tr><td class="role">B.Eng., Industrial Engineering, <b>SIIT, Thammasat University</b></td><td class="when">2020</td></tr></table>
<p class="certs"><b>Certificates:</b> Google Business Intelligence (Coursera) · Certified Professional Data Analyst (DataRockie) · Road to Data Engineer (DataTH)</p>
"""

CSS = """
* { font-family: sans-serif; }
body { font-size: 9.1pt; color: #1b2a44; line-height: 1.3; }
.name { font-size: 22pt; font-weight: bold; color: #14305F; text-align: center; letter-spacing: 1pt; }
.headline { font-size: 11pt; text-align: center; color: #C99A2E; font-weight: bold; letter-spacing: 0.8pt; margin-top: 1pt; }
.contact { font-size: 8.6pt; text-align: center; color: #4A5878; margin-top: 3pt; margin-bottom: 4pt; }
h2 { font-size: 11pt; color: #14305F; border-bottom: 1.2pt solid #C99A2E; margin-top: 7pt; margin-bottom: 3pt; padding-bottom: 1pt; text-transform: uppercase; letter-spacing: 0.6pt; }
p { margin-top: 0; margin-bottom: 3pt; }
ul { margin-top: 1pt; margin-bottom: 3pt; padding-left: 12pt; }
li { margin-bottom: 1pt; }
table { width: 100%; margin-top: 2pt; }
td.role { font-size: 10pt; color: #14305F; }
td.when { text-align: right; color: #4A5878; font-size: 9pt; white-space: nowrap; }
.certs { margin-top: 4pt; }
"""

story = pymupdf.Story(html=HTML, user_css=CSS)
writer = pymupdf.DocumentWriter(out)
mediabox = pymupdf.paper_rect("a4")
where = mediabox + (36, 28, -36, -28)
pages = 0
more = True
while more:
    dev = writer.begin_page(mediabox)
    more, _ = story.place(where)
    story.draw(dev)
    writer.end_page()
    pages += 1
writer.close()
print("pages:", pages)
