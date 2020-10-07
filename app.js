class App {
    constructor() {
        this.notes = []; //store user notes as array
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
    this.$modalCloseButton = document.querySelector('.modal-close-button')

    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener('click', event => {
        this.handleFormClick(event);
        this.selectNote(event); 
        this.openModal(event);
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
    this.displayNotes();
    this.closeForm();
  }

  editNote(){
      const title = this.$modalTitle.value;
      const text =  this.$modalText.value;
      this.notes = this.notes.map( note => 
          note.id === Number(this.id) ? {...note, title, text} : note
      );
      this.displayNotes();
      
  }

  selectNote(event){
      const $selectedNote = event.target.closest('.note');
      if (!$selectedNote) return;
      const[$noteTitle, $noteText]= $selectedNote.children;
      this.text = $noteText.innerHTML;
      this.title = $noteTitle.innerHTML;
      this.id = $selectedNote.dataset.id; //dataset: <div data-id = "${note.id}">
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
              <img class="toolbar-color" src="https://icon.now.sh/palette">
              <img class="toolbar-delete" src="https://icon.now.sh/delete">
            </div>
          </div>
        </div>
        ` ).join("");
    //<div class="${note.title && 'note-title'}">: if note.title is truy, then set class = 'note-title'
  }
}

new App();
