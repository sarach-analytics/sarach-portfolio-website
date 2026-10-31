#!/usr/bin/env python3
"""
Script to replace lessons 5-9 with brief content + video placeholders
"""

# Read the file
with open('course-sql-lesson.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the new brief lessons
lessons_brief = {
    5: {
        'en_title': 'What is DBMS?',
        'th_title': 'DBMS คืออะไร?',
        'en_video_title': 'Watch: Database Management Systems Explained',
        'th_video_title': 'ดูวิดีโอ: ระบบจัดการฐานข้อมูลคืออะไร?',
        'en_content': '''<h2>Database Management System (DBMS)</h2>
                <p>A <strong>DBMS</strong> is software that manages databases. It acts as an interface between users and the database.</p>

                <h3>Popular DBMS:</h3>
                <ul>
                    <li>🐬 <strong>MySQL</strong> - Most popular open-source (WordPress, Facebook)</li>
                    <li>🐘 <strong>PostgreSQL</strong> - Advanced open-source (Instagram, Reddit)</li>
                    <li>🏢 <strong>SQL Server</strong> - Microsoft enterprise solution</li>
                    <li>🎯 <strong>Oracle</strong> - Large enterprise systems (Banks, government)</li>
                    <li>📱 <strong>SQLite</strong> - Lightweight for mobile apps</li>
                </ul>

                <div class="info-box" style="margin: 20px 0; background: #e8f5e9; border-left-color: #4caf50;">
                    <h4>💡 Key Point</h4>
                    <p>DBMS handles security, storage, backup, and multi-user access for databases.</p>
                </div>''',
        'th_content': '''<h2>ระบบจัดการฐานข้อมูล (DBMS)</h2>
                <p><strong>DBMS</strong> คือ ซอฟต์แวร์ที่จัดการฐานข้อมูล ทำหน้าที่เป็นตัวกลางระหว่างผู้ใช้และฐานข้อมูล</p>

                <h3>DBMS ยอดนิยม:</h3>
                <ul>
                    <li>🐬 <strong>MySQL</strong> - โอเพนซอร์สที่ได้รับความนิยมสูงสุด (WordPress, Facebook)</li>
                    <li>🐘 <strong>PostgreSQL</strong> - โอเพนซอร์สขั้นสูง (Instagram, Reddit)</li>
                    <li>🏢 <strong>SQL Server</strong> - โซลูชันองค์กรของ Microsoft</li>
                    <li>🎯 <strong>Oracle</strong> - ระบบองค์กรขนาดใหญ่ (ธนาคาร, ภาครัฐ)</li>
                    <li>📱 <strong>SQLite</strong> - น้ำหนักเบาสำหรับแอปมือถือ</li>
                </ul>

                <div class="info-box" style="margin: 20px 0; background: #e8f5e9; border-left-color: #4caf50;">
                    <h4>💡 จุดสำคัญ</h4>
                    <p>DBMS จัดการความปลอดภัย การจัดเก็บ การสำรอง และการเข้าถึงพร้อมกันสำหรับฐานข้อมูล</p>
                </div>'''
    },
    6: {
        'en_title': 'Types of Databases',
        'th_title': 'ประเภทของ Databases',
        'en_video_title': 'Watch: SQL vs NoSQL Databases',
        'th_video_title': 'ดูวิดีโอ: SQL vs NoSQL Databases',
        'en_content': '''<h2>Two Main Types of Databases</h2>

                <h3>1. Relational Databases (SQL)</h3>
                <ul>
                    <li>📊 Data stored in tables with rows and columns</li>
                    <li>🔗 Relationships between tables using keys</li>
                    <li>✅ Examples: MySQL, PostgreSQL, SQL Server, Oracle</li>
                    <li>🎯 Best for: Banking, e-commerce, structured data</li>
                </ul>

                <h3>2. NoSQL Databases</h3>
                <ul>
                    <li>📄 Flexible data structures (documents, key-value, graphs)</li>
                    <li>⚡ Faster for certain use cases</li>
                    <li>✅ Examples: MongoDB, Redis, Cassandra, Neo4j</li>
                    <li>🎯 Best for: Big data, real-time apps, social networks</li>
                </ul>

                <div class="info-box" style="margin: 20px 0; background: #fff3e0; border-left-color: #ff9800;">
                    <h4>💡 This Course Focuses On</h4>
                    <p><strong>SQL (Relational) databases</strong> - used by 90% of businesses and essential for data analysis.</p>
                </div>''',
        'th_content': '''<h2>ฐานข้อมูล 2 ประเภทหลัก</h2>

                <h3>1. Relational Databases (SQL)</h3>
                <ul>
                    <li>📊 ข้อมูลจัดเก็บในตารางที่มีแถวและคอลัมน์</li>
                    <li>🔗 ความสัมพันธ์ระหว่างตารางโดยใช้ keys</li>
                    <li>✅ ตัวอย่าง: MySQL, PostgreSQL, SQL Server, Oracle</li>
                    <li>🎯 เหมาะกับ: ธนาคาร, อีคอมเมิร์ซ, ข้อมูลมีโครงสร้าง</li>
                </ul>

                <h3>2. NoSQL Databases</h3>
                <ul>
                    <li>📄 โครงสร้างข้อมูลยืดหยุ่น (documents, key-value, graphs)</li>
                    <li>⚡ เร็วกว่าในบางกรณี</li>
                    <li>✅ ตัวอย่าง: MongoDB, Redis, Cassandra, Neo4j</li>
                    <li>🎯 เหมาะกับ: Big data, แอป real-time, social networks</li>
                </ul>

                <div class="info-box" style="margin: 20px 0; background: #fff3e0; border-left-color: #ff9800;">
                    <h4>💡 คอร์สนี้เน้น</h4>
                    <p><strong>SQL (Relational) databases</strong> - ใช้โดย 90% ของธุรกิจและจำเป็นสำหรับการวิเคราะห์ข้อมูล</p>
                </div>'''
    },
    7: {
        'en_title': 'SQL Commands Overview (DDL, DML, DCL, TCL)',
        'th_title': 'ภาพรวมคำสั่ง SQL (DDL, DML, DCL, TCL)',
        'en_video_title': 'Watch: SQL Command Categories Explained',
        'th_video_title': 'ดูวิดีโอ: หมวดหมู่คำสั่ง SQL',
        'en_content': '''<h2>Four SQL Command Categories</h2>

                <h3>1. DDL - Data Definition Language 🏗️</h3>
                <p><strong>Define database structure</strong></p>
                <ul>
                    <li>CREATE - Create tables/databases</li>
                    <li>ALTER - Modify structure</li>
                    <li>DROP - Delete tables/databases</li>
                </ul>

                <h3>2. DML - Data Manipulation Language 📝</h3>
                <p><strong>Manipulate data (Most Important!)</strong></p>
                <ul>
                    <li>SELECT - Retrieve data ⭐</li>
                    <li>INSERT - Add new data</li>
                    <li>UPDATE - Modify data</li>
                    <li>DELETE - Remove data</li>
                </ul>

                <h3>3. DCL - Data Control Language 🔐</h3>
                <p><strong>Control access</strong></p>
                <ul>
                    <li>GRANT - Give permissions</li>
                    <li>REVOKE - Remove permissions</li>
                </ul>

                <h3>4. TCL - Transaction Control Language 🔄</h3>
                <p><strong>Manage transactions</strong></p>
                <ul>
                    <li>COMMIT - Save changes</li>
                    <li>ROLLBACK - Undo changes</li>
                </ul>

                <div class="info-box" style="margin: 20px 0; background: #e8f5e9; border-left-color: #4caf50;">
                    <h4>💡 Course Focus</h4>
                    <p>This course emphasizes <strong>DML (especially SELECT)</strong> - 90% of SQL work is querying data!</p>
                </div>''',
        'th_content': '''<h2>หมวดหมู่คำสั่ง SQL 4 ประเภท</h2>

                <h3>1. DDL - Data Definition Language 🏗️</h3>
                <p><strong>กำหนดโครงสร้างฐานข้อมูล</strong></p>
                <ul>
                    <li>CREATE - สร้างตาราง/ฐานข้อมูล</li>
                    <li>ALTER - แก้ไขโครงสร้าง</li>
                    <li>DROP - ลบตาราง/ฐานข้อมูล</li>
                </ul>

                <h3>2. DML - Data Manipulation Language 📝</h3>
                <p><strong>จัดการข้อมูล (สำคัญที่สุด!)</strong></p>
                <ul>
                    <li>SELECT - ดึงข้อมูล ⭐</li>
                    <li>INSERT - เพิ่มข้อมูลใหม่</li>
                    <li>UPDATE - แก้ไขข้อมูล</li>
                    <li>DELETE - ลบข้อมูล</li>
                </ul>

                <h3>3. DCL - Data Control Language 🔐</h3>
                <p><strong>ควบคุมการเข้าถึง</strong></p>
                <ul>
                    <li>GRANT - ให้สิทธิ์</li>
                    <li>REVOKE - เพิกถอนสิทธิ์</li>
                </ul>

                <h3>4. TCL - Transaction Control Language 🔄</h3>
                <p><strong>จัดการ transactions</strong></p>
                <ul>
                    <li>COMMIT - บันทึกการเปลี่ยนแปลง</li>
                    <li>ROLLBACK - ยกเลิกการเปลี่ยนแปลง</li>
                </ul>

                <div class="info-box" style="margin: 20px 0; background: #e8f5e9; border-left-color: #4caf50;">
                    <h4>💡 คอร์สเน้น</h4>
                    <p>คอร์สนี้เน้น <strong>DML (โดยเฉพาะ SELECT)</strong> - 90% ของงาน SQL คือการ query ข้อมูล!</p>
                </div>'''
    },
    8: {
        'en_title': 'Why Learn SQL?',
        'th_title': 'ทำไมต้องเรียน SQL?',
        'en_video_title': 'Watch: Career Benefits of Learning SQL',
        'th_video_title': 'ดูวิดีโอ: ประโยชน์ของการเรียน SQL ต่ออาชีพ',
        'en_content': '''<h2>Why SQL is Essential</h2>

                <h3>🚀 Career Opportunities</h3>
                <ul>
                    <li><strong>High Demand:</strong> SQL is #3 most in-demand tech skill</li>
                    <li><strong>High Salary:</strong> Data analysts earn $70K-$120K+ annually</li>
                    <li><strong>Many Roles:</strong> Data Analyst, BI Analyst, Data Scientist, Backend Developer</li>
                </ul>

                <h3>📊 Practical Applications</h3>
                <ul>
                    <li>Analyze business data and create reports</li>
                    <li>Build dashboards and visualizations</li>
                    <li>Make data-driven decisions</li>
                    <li>Automate data workflows</li>
                </ul>

                <h3>✅ Easy to Learn</h3>
                <ul>
                    <li>English-like syntax: <code>SELECT name FROM customers</code></li>
                    <li>Learn basics in weeks, master in months</li>
                    <li>Transferable to all databases</li>
                </ul>

                <div class="info-box" style="margin: 20px 0; background: #e3f2fd; border-left-color: #2196f3;">
                    <h4>💡 Fun Fact</h4>
                    <p>SQL has been around since the 1970s and is still #1 database language - it's not going away!</p>
                </div>''',
        'th_content': '''<h2>ทำไม SQL ถึงจำเป็น</h2>

                <h3>🚀 โอกาสในอาชีพ</h3>
                <ul>
                    <li><strong>ความต้องการสูง:</strong> SQL เป็นทักษะเทคโนโลยีที่ต้องการมากอันดับ 3</li>
                    <li><strong>เงินเดือนสูง:</strong> นักวิเคราะห์ข้อมูลได้ $70K-$120K+ ต่อปี</li>
                    <li><strong>หลายอาชีพ:</strong> Data Analyst, BI Analyst, Data Scientist, Backend Developer</li>
                </ul>

                <h3>📊 การประยุกต์ใช้จริง</h3>
                <ul>
                    <li>วิเคราะห์ข้อมูลธุรกิจและสร้างรายงาน</li>
                    <li>สร้าง dashboards และ visualizations</li>
                    <li>ตัดสินใจโดยใช้ข้อมูล</li>
                    <li>อัตโนมัติ data workflows</li>
                </ul>

                <h3>✅ เรียนง่าย</h3>
                <ul>
                    <li>ไวยากรณ์คล้ายภาษาอังกฤษ: <code>SELECT name FROM customers</code></li>
                    <li>เรียนพื้นฐานได้ในสัปดาห์ เชี่ยวชาญในเดือน</li>
                    <li>ใช้ได้กับทุก database</li>
                </ul>

                <div class="info-box" style="margin: 20px 0; background: #e3f2fd; border-left-color: #2196f3;">
                    <h4>💡 ความจริงที่น่าสนใจ</h4>
                    <p>SQL มีมาตั้งแต่ปี 1970 และยังคงเป็นภาษา database อันดับ 1 - ไม่มีทางหายไป!</p>
                </div>'''
    },
    9: {
        'en_title': 'Setup & Install Environment',
        'th_title': 'ติดตั้งและตั้งค่าสภาพแวดล้อม',
        'en_video_title': 'Watch: SQL Environment Setup Tutorial',
        'th_video_title': 'ดูวิดีโอ: วิธีติดตั้งสภาพแวดล้อม SQL',
        'en_content': '''<h2>Getting Started with SQL</h2>

                <h3>Option 1: Online SQL Editors (Recommended for Beginners)</h3>
                <p><strong>No installation required! Start coding immediately:</strong></p>
                <ul>
                    <li>🌐 <strong><a href="https://sqliteonline.com/" target="_blank">SQLite Online</a></strong> - Simple & fast</li>
                    <li>🌐 <strong><a href="https://www.db-fiddle.com/" target="_blank">DB Fiddle</a></strong> - Supports multiple databases</li>
                    <li>🌐 <strong><a href="https://www.programiz.com/sql/online-compiler/" target="_blank">Programiz SQL</a></strong> - Interactive tutorials</li>
                </ul>

                <h3>Option 2: Install Database Locally</h3>

                <h4>MySQL (Most Popular)</h4>
                <ol>
                    <li>Download: <a href="https://dev.mysql.com/downloads/mysql/" target="_blank">MySQL Community Server</a></li>
                    <li>Download: <a href="https://dev.mysql.com/downloads/workbench/" target="_blank">MySQL Workbench</a> (GUI Tool)</li>
                    <li>Follow installation wizard</li>
                    <li>Set root password during setup</li>
                </ol>

                <h4>PostgreSQL (Advanced)</h4>
                <ol>
                    <li>Download: <a href="https://www.postgresql.org/download/" target="_blank">PostgreSQL</a></li>
                    <li>Download: <a href="https://www.pgadmin.org/download/" target="_blank">pgAdmin</a> (GUI Tool)</li>
                    <li>Follow installation wizard</li>
                </ol>

                <div class="info-box" style="margin: 20px 0; background: #fff8e1; border-left-color: #ffa726;">
                    <h4>💡 Recommendation</h4>
                    <p><strong>Start with online editors</strong> for this course - you'll learn faster without installation hassles!</p>
                </div>

                <h3>What You'll Need</h3>
                <ul>
                    <li>✅ Computer with internet (for online editors)</li>
                    <li>✅ Web browser (Chrome, Firefox, Edge)</li>
                    <li>✅ Willingness to practice!</li>
                </ul>''',
        'th_content': '''<h2>เริ่มต้นกับ SQL</h2>

                <h3>ตัวเลือก 1: SQL Editors ออนไลน์ (แนะนำสำหรับมือใหม่)</h3>
                <p><strong>ไม่ต้องติดตั้ง! เริ่มเขียนโค้ดได้ทันที:</strong></p>
                <ul>
                    <li>🌐 <strong><a href="https://sqliteonline.com/" target="_blank">SQLite Online</a></strong> - ง่ายและเร็ว</li>
                    <li>🌐 <strong><a href="https://www.db-fiddle.com/" target="_blank">DB Fiddle</a></strong> - รองรับหลาย database</li>
                    <li>🌐 <strong><a href="https://www.programiz.com/sql/online-compiler/" target="_blank">Programiz SQL</a></strong> - บทเรียนแบบโต้ตอบ</li>
                </ul>

                <h3>ตัวเลือก 2: ติดตั้ง Database ในเครื่อง</h3>

                <h4>MySQL (ได้รับความนิยมสูงสุด)</h4>
                <ol>
                    <li>ดาวน์โหลด: <a href="https://dev.mysql.com/downloads/mysql/" target="_blank">MySQL Community Server</a></li>
                    <li>ดาวน์โหลด: <a href="https://dev.mysql.com/downloads/workbench/" target="_blank">MySQL Workbench</a> (เครื่องมือ GUI)</li>
                    <li>ทำตามขั้นตอนการติดตั้ง</li>
                    <li>ตั้งรหัส root ระหว่างติดตั้ง</li>
                </ol>

                <h4>PostgreSQL (ขั้นสูง)</h4>
                <ol>
                    <li>ดาวน์โหลด: <a href="https://www.postgresql.org/download/" target="_blank">PostgreSQL</a></li>
                    <li>ดาวน์โหลด: <a href="https://www.pgadmin.org/download/" target="_blank">pgAdmin</a> (เครื่องมือ GUI)</li>
                    <li>ทำตามขั้นตอนการติดตั้ง</li>
                </ol>

                <div class="info-box" style="margin: 20px 0; background: #fff8e1; border-left-color: #ffa726;">
                    <h4>💡 คำแนะนำ</h4>
                    <p><strong>เริ่มด้วย online editors</strong> สำหรับคอร์สนี้ - คุณจะเรียนเร็วขึ้นโดยไม่ต้องยุ่งกับการติดตั้ง!</p>
                </div>

                <h3>สิ่งที่คุณต้องมี</h3>
                <ul>
                    <li>✅ คอมพิวเตอร์ที่มีอินเทอร์เน็ต (สำหรับ online editors)</li>
                    <li>✅ เว็บเบราว์เซอร์ (Chrome, Firefox, Edge)</li>
                    <li>✅ ความตั้งใจที่จะฝึกฝน!</li>
                </ul>'''
    }
}

print("Generating brief lessons 5-9...")

# For each lesson, create the brief version
for lesson_num in [5, 6, 7, 8, 9]:
    lesson = lessons_brief[lesson_num]

    # Create the video placeholder HTML
    video_placeholder_en = f'''
                <div class="video-container" style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    <p style="margin-bottom: 15px;"><strong>📺 {lesson['en_video_title']}</strong></p>
                    <!-- <iframe width="100%" height="400" src="YOUR_YOUTUBE_LINK_HERE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
                    <div style="background: #e0e0e0; padding: 60px 20px; border-radius: 4px;">
                        <p style="color: #666; margin: 0;">Video placeholder - Add your video link here</p>
                    </div>
                </div>'''

    video_placeholder_th = f'''
                <div class="video-container" style="margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                    <p style="margin-bottom: 15px;"><strong>📺 {lesson['th_video_title']}</strong></p>
                    <!-- <iframe width="100%" height="400" src="YOUR_YOUTUBE_LINK_HERE" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> -->
                    <div style="background: #e0e0e0; padding: 60px 20px; border-radius: 4px;">
                        <p style="color: #666; margin: 0;">ที่วางวิดีโอ - เพิ่มลิงก์วิดีโอของคุณที่นี่</p>
                    </div>
                </div>'''

    # Find where lesson starts and ends
    # Try to find the lesson marker with flexible whitespace
    import re
    lesson_pattern = rf'\s+{lesson_num}:\s+\{{'

    # Find the next lesson marker to know where current lesson ends
    next_lesson = lesson_num + 1
    next_lesson_pattern = rf'\s+{next_lesson}:\s+\{{'

    # Find positions
    try:
        # Use regex to find lesson start with flexible whitespace
        match = re.search(lesson_pattern, content)
        if not match:
            raise ValueError(f"Could not find lesson {lesson_num}")

        start_pos = match.start()

        # Find the next lesson
        next_match = re.search(next_lesson_pattern, content[start_pos + 10:])
        if not next_match:
            # If no next lesson found, this might be the last lesson
            # Try to find the closing bracket
            end_pos = len(content)
        else:
            end_pos = start_pos + 10 + next_match.start()

        # Determine the indentation by looking at the matched start
        indent = match.group().split(str(lesson_num))[0]

        # Replace lesson content with matching indentation
        new_lesson_content = f'''{indent}{lesson_num}: {{
{indent}    en: {{
{indent}        title: "{lesson['en_title']}",
{indent}        content: `{lesson['en_content']}{video_placeholder_en}
{indent}        `
{indent}    }},
{indent}    th: {{
{indent}        title: "{lesson['th_title']}",
{indent}        content: `{lesson['th_content']}{video_placeholder_th}
{indent}        `
{indent}    }}
{indent}}},
'''

        # Replace in content
        content = content[:start_pos] + new_lesson_content + content[end_pos:]
        print(f"[OK] Replaced lesson {lesson_num}")
    except ValueError as e:
        print(f"[ERROR] Error finding lesson {lesson_num}: {e}")

# Write updated content
with open('course-sql-lesson.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n[SUCCESS] All lessons 5-9 have been updated with brief content + video placeholders!")
print("File saved: course-sql-lesson.html")
