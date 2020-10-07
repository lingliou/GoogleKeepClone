class App {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem('notes')) || []; 
        //if localStorage has notes it will show, otherwise it's a empty array
        this.title = ''; //in selectNote methode will update this varibels
        this.text ='';   //so it can be used globally
        this.id ='';

    //dom element indicated start with $
    this.$placeholder = document.querySelector('#placeholder');
    this.$form = document.querySelector('#form');
    this.$notes = document.querySelector('#notes');
    this.$noteTitle = document.querySelector('#note-title');
    this.$noteText = document.querySelector('#note-text');
    this.$formButtons = document.querySelector('#form-buttons');
    this.$formCloseButton = document.querySelector('#form-close-button');
    this.$modal = document.querySelector('.modal');
    this.$modalTitle = document.querySelector('.modal-title');
    this.$modalText = document.querySelector('.modal-text');
    this.$modalCloseButton = document.querySelector('.modal-close-button');
    this.$colorTooltip = document.querySelector('#color-tooltip');

    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener('click', event => {
        this.handleFormClick(event);
        this.selectNote(event); 
        this.openModal(event);
        this.deleteNote(event);
    });

    document.body.addEventListener('mouseover', event => {
        this.openTooltip(event);
    });

    document.body.addEventListener('mouseout', event => {
        this.closeTooltip(event);
    });

    this.$colorTooltip.addEventListener('mouseover', function(){
        this.style.display = 'flex';
    });

    this.$colorTooltip.addEventListener('mouseout', function(){
        this.style.display = 'none';
    });

    this.$colorTooltip.addEventListener('click', event =>{
        const color = event.target.dataset.color;
        if (color){
            this.editNoteColor(color);
        }
    });

    this.$form.addEventListener('submit', event => {
        event.preventDefault();
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const hasNote = title || text;

        if (hasNote) {
            this.addNote({ text, title });
        }
    });

    this.$formCloseButton.addEventListener('click', event =>{
        event.stopPropagation();
        this.closeForm();
    });

    this.$modalCloseButton.addEventListener('click', event =>{
        this.closeModal(event);
    })

  }

  handleFormClick(event) {
    const isFormClicked = this.$form.contains(event.target);
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const hasNote = title || text;

    if (isFormClicked) {
      this.openForm();
    }
    else if(hasNote){
        this.addNote({text, title});
    }
    else {
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add('form-open');
    this.$noteTitle.style.display = 'block';
    this.$formButtons.style.display = 'block';
  }

  closeForm() {
    this.$form.classList.remove('form-open');
    this.$noteTitle.style.display = 'none';
    this.$formButtons.style.display = 'none';
    this.$noteText.value = '';
    this.$noteTitle.value = '';
  }

  openModal(event){
    if (event.target.matches('.toolbar-delete')) return;

    if(event.target.closest('.note')){
        this.$modal.classList.toggle('open-modal');
        this.$modalTitle.value = this.title;
        this.$modalText.value = this.text;
      }
  }

  closeModal(event){
      this.editNote();
      this.$modal.classList.toggle('open-modal');
  }

  openTooltip(event){
      
    if (!event.target.matches('.toolbar-color')) return;
    this.id = event.target.dataset.id; 
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left + window.scrollX;
    const vertical = noteCoords.top + window.scrollY;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = 'flex';

  }

  closeTooltip(){
    if (!event.target.matches('.toolbar-color')) return;
    this.$colorTooltip.style.display = 'none';
  }

  addNote({text, title}) {
    const newNote = {
      title,
      text,
      color: "white",
      id: this.notes.length > 0 ?
        this.notes[this.notes.length - 1].id + 1 :
        1
    };
    this.notes = [...this.notes, newNote];
    this.render();
    this.closeForm();
  }

  editNote(){
      const title = this.$modalTitle.value;
      const text =  this.$modalText.value;
      this.notes = this.notes.map( note => 
          note.id === Number(this.id) ? {...note, title, text} : note
      );
      this.render();
      
  }

  editNoteColor(color){
    this.notes = this.notes.map(note =>
        note.id === Number(this.id) ? {...note, color} : note
    );
    this.render();
  }

  selectNote(event){
      const $selectedNote = event.target.closest('.note');
      if (!$selectedNote) return;
      const[$noteTitle, $noteText]= $selectedNote.children;
      this.text = $noteText.innerHTML;
      this.title = $noteTitle.innerHTML;
      this.id = $selectedNote.dataset.id; //dataset: <div data-id = "${note.id}">
  }

  deleteNote(event){
      event.stopPropagation();
      if(!event.target.matches('.toolbar-delete')) return;
      const id = event.target.dataset.id;
      this.notes = this.notes.filter(note => note.id !== Number(id));
      this.render();
  }

  render(){
      this.saveNotes();
      this.displayNotes();
  }

  saveNotes(){
      localStorage.setItem('notes', JSON.stringify(this.notes)) 
      //setItem need take a key & value pair and the value must be a string
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? 'none' : 'flex';

    this.$notes.innerHTML = this.notes.map(note => `
        <div style ="background : ${note.color};" class="note" data-id ="${note.id}">
            <div class="${note.title && 'note-title'}">${note.title} </div>
            <div class="note-text">${note.text}</div>
            <div class="toolbar-container">
            <div class="toolbar">
              <img class="toolbar-color" data-id="${note.id}" src="https://icon.now.sh/palette">
              <img class="toolbar-delete" data-id="${note.id}" src="https://icon.now.sh/delete">
            </div>
          </div>
        </div>
        ` ).join("");
    //<div class="${note.title && 'note-title'}">: if note.title is truy, then set class = 'note-title'
  }
}

new App();
