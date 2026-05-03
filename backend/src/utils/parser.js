// ─────────────────────────────────────────
// Validate and parse incoming ticket data
// ─────────────────────────────────────────

// Validates a new ticket coming in for analysis
export function parseIncomingTicket(body) {
    const errors = []

    // Check required fields
    if (!body.title || body.title.trim() === '') {
        errors.push('title is required')
    }

    if (!body.description || body.description.trim() === '') {
        errors.push('description is required')
    }

    // Check field lengths
    if (body.title && body.title.length > 200) {
        errors.push('title must be under 200 characters')
    }

    if (body.description && body.description.length > 2000) {
        errors.push('description must be under 2000 characters')
    }

    // If any errors found, return them
    if (errors.length > 0) {
        return { valid: false, errors }
    }

    // Clean and return the data
    return {
        valid: true,
        data: {
            title: body.title.trim(),
            description: body.description.trim(),
            category: body.category?.trim() || 'General',
            priority: body.priority?.trim() || 'medium',
            // Combine title and description into one text for RAG search
            // This is what gets sent to the embedding model
            searchText: `Title: ${body.title.trim()} Description: ${body.description.trim()}`,
        },
    }
}

// Validates feedback submission
export function parseFeedback(body) {
    const errors = []

    if (!body.ticketId || body.ticketId.trim() === '') {
        errors.push('ticketId is required')
    }

    if (body.helpful === undefined || body.helpful === null) {
        errors.push('helpful (true/false) is required')
    }

    if (typeof body.helpful !== 'boolean') {
        errors.push('helpful must be a boolean (true or false)')
    }

    if (errors.length > 0) {
        return { valid: false, errors }
    }

    return {
        valid: true,
        data: {
            ticketId: body.ticketId.trim(),
            helpful: body.helpful,
            comment: body.comment?.trim() || null,
        },
    }
}