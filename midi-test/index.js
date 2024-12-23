document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById("midi-file-input");
    const synth = new Tone.PolySynth().toDestination(); // Use PolySynth for concurrency
    const root = document.getElementById('root');
    let linePanels = [];

    // Create lines in the panel
    function createLine() {
        const linePanel = document.createElement('div');
        linePanel.id = 'linePanel';
        for (let i = 0; i < 6; i++) {
            let line = document.createElement('div');
            line.className = 'line';
            line.id = `line-${i}`;
            linePanel.appendChild(line);
        }
        root.appendChild(linePanel);
        linePanels = Array.from(linePanel.children); // Store references to the line panels
    }

    // Read the MIDI file
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const arrayBuffer = e.target.result;
                processMIDIFile(arrayBuffer);
            };
            reader.readAsArrayBuffer(file);
        }
    });

    function processMIDIFile(arrayBuffer) {
        // Assuming you are using a MIDI parsing library (e.g., MIDI.js or Tone.js directly)
        const midiFile = new MIDIFile(arrayBuffer);
        const events = midiFile.getMidiEvents();
        const ticksPerQuarterNote = midiFile.header.getTicksPerBeat();
        const msPerTick = 60000 / (120 * ticksPerQuarterNote); // Precompute once

        let currentTime = 0; // Track time in milliseconds
        events.forEach(event => {
            // Note On event
            if (event.subtype === 0x09) {
                const noteNumber = event.param1;
                currentTime += event.delta * msPerTick; // Convert delta (ticks) to milliseconds
                createNote(noteNumber % 6, noteNumber, currentTime); // Create note on screen and trigger sound
            }
        });
    }

    // Create note div and add it to the respective line
    function createNote(i, noteNumber, timeStamp) {
        setTimeout(() => {
            const line = linePanels[i];
            const note = document.createElement('div');
            note.className = 'note';
            note.innerHTML = noteNumber;
            line.appendChild(note);

            // Trigger the PolySynth to play the note
            synth.triggerAttackRelease(Tone.Frequency(noteNumber, "midi").toFrequency(), "8n");
        }, timeStamp);
    }

    createLine(); // Initialize the line panel for notes
});
