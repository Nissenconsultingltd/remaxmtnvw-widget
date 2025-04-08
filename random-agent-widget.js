fetch('https://www.remaxmtnview.ca/agents.php?page=1')
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const agentBoxes = [...doc.querySelectorAll('.listing-box-image')];

    if (agentBoxes.length === 0) throw new Error('No agent boxes found.');

    const randomBox = agentBoxes[Math.floor(Math.random() * agentBoxes.length)];
    const img = randomBox.querySelector('img');
    const link = randomBox.querySelector('a');

    const photo = img?.src || 'https://www.remaxmtnview.ca/images/default-agent.png';
    const name = link?.getAttribute('aria-label') || 'RE/MAX Agent';
    const profile = link?.href ? new URL(link.getAttribute('href'), 'https://www.remaxmtnview.ca').href : '#';

    document.getElementById('random-agent-widget').innerHTML = `
      <h3>Meet an Agent</h3>
      <img src="${photo}" alt="${name}" style="max-width:100%;border-radius:8px;">
      <p><strong>${name}</strong></p>
      <a href="${profile}" target="_blank">View Profile</a>
    `;
  })
  .catch(err => {
    console.error(err);
    document.getElementById('random-agent-widget').textContent = 'Could not load agent.';
  });
