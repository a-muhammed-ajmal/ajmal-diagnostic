import { ContactForm } from "ajmal-diagnostic";

// Posts to /api/contact when submitted; in a preview it renders the empty form,
// which is the state a design is composed against.

/** The enquiry form: name, email, phone, company, inquiry type and message. */
export function Empty() {
  return <ContactForm />;
}
