package com.cicdproject.backend.service;

import com.cicdproject.backend.model.Attendee;
import com.cicdproject.backend.model.Event;
import com.cicdproject.backend.repository.AttendeeRepository;
import com.cicdproject.backend.repository.EventRepository;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfService {

    private final EventRepository eventRepository;
    private final AttendeeRepository attendeeRepository;

    public PdfService(EventRepository eventRepository, AttendeeRepository attendeeRepository) {
        this.eventRepository = eventRepository;
        this.attendeeRepository = attendeeRepository;
    }

    public byte[] generateAttendeesPdf(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new EntityNotFoundException("Event not found with id: " + eventId));
        List<Attendee> attendees = attendeeRepository.findByEventId(eventId);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try (Document document = new Document(PageSize.A4)) {
            PdfWriter.getInstance(document, out);
            document.open();

            // PDF Design
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Font.NORMAL, Color.DARK_GRAY);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Font.NORMAL, Color.WHITE);
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 11, Font.NORMAL, Color.BLACK);
            Color headerBgColor = new Color(75, 85, 99);
            Color alternateRowBgColor = new Color(243, 244, 246);

            // Add the Event Title
            Paragraph title = new Paragraph(event.getTitle(), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(25);
            document.add(title);

            // CHANGED: Reverted to 4 columns
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            // CHANGED: Adjusted widths for 4 columns
            table.setWidths(new float[] { 1, 4, 5, 2 });

            // Add Table Headers
            // CHANGED: Removed "Contact Number"
            String[] headers = { "S.No", "Name", "Email", "Tickets" };
            for (String headerTitle : headers) {
                PdfPCell headerCell = new PdfPCell(new Phrase(headerTitle, headerFont));
                headerCell.setBackgroundColor(headerBgColor);
                headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                headerCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
                headerCell.setPadding(8);
                headerCell.setBorderWidth(0);
                table.addCell(headerCell);
            }

            // Add Data Rows
            int serialNumber = 1;
            for (Attendee attendee : attendees) {
                Color bgColor = (serialNumber % 2 == 0) ? Color.WHITE : alternateRowBgColor;

                PdfPCell cell;

                cell = new PdfPCell(new Phrase(String.valueOf(serialNumber++), bodyFont));
                cell.setBackgroundColor(bgColor);
                cell.setPadding(8);
                cell.setBorderWidth(0);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(attendee.getName(), bodyFont));
                cell.setBackgroundColor(bgColor);
                cell.setPadding(8);
                cell.setBorderWidth(0);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(attendee.getEmail(), bodyFont));
                cell.setBackgroundColor(bgColor);
                cell.setPadding(8);
                cell.setBorderWidth(0);
                // ADDED: This allows long emails to wrap to the next line
                cell.setNoWrap(false);
                table.addCell(cell);

                cell = new PdfPCell(new Phrase(String.valueOf(attendee.getTickets()), bodyFont));
                cell.setBackgroundColor(bgColor);
                cell.setPadding(8);
                cell.setBorderWidth(0);
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);

                // REMOVED: The Contact Number cell has been removed.
            }

            document.add(table);

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }
}