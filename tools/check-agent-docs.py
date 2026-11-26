"""Check the agent docs: every Markdown link in AGENTS.md, CLAUDE.md and docs/agents/*.md points to a file or folder that
exists, and every guide in docs/agents/ is linked from AGENTS.md (otherwise no agent would find it).

    python3 tools/check-agent-docs.py        exit 0 = all good; otherwise it lists what is broken

Run it before committing a change to these files (AGENTS.md → "Checking before you push").
"""
import glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINK = re.compile(r'\]\(([^)\s]+)\)')
FENCE = re.compile(r'```.*?```', re.S)


def main():
    docs = ['AGENTS.md', 'CLAUDE.md'] + sorted(os.path.relpath(p, ROOT) for p in glob.glob(os.path.join(ROOT, 'docs/agents/*.md')))
    problems = []
    for doc in docs:
        text = FENCE.sub('', open(os.path.join(ROOT, doc), encoding='utf-8').read())
        for target in LINK.findall(text):
            if re.match(r'^[a-z]+:', target) or target.startswith('#'):
                continue  # web link or anchor
            path = os.path.normpath(os.path.join(ROOT, os.path.dirname(doc), target.split('#')[0]))
            if not os.path.exists(path):
                problems.append('%s: link to %s does not exist' % (doc, target))
    agents = open(os.path.join(ROOT, 'AGENTS.md'), encoding='utf-8').read()
    for doc in docs[2:]:
        if '](%s)' % doc not in agents:
            problems.append('%s is not linked from AGENTS.md ("Topic guides")' % doc)
    for p in problems:
        print(p)
    print('Agent docs: %d files, %s.' % (len(docs), 'all links fine' if not problems else '%d problem(s)' % len(problems)))
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
