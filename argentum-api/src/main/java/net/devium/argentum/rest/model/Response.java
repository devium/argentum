package net.devium.argentum.rest.model;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class Response<T> {
    private T data;
    private String error;

    public Response(T data, String error) {
        this.data = data;
        this.error = error;
    }

    public Response(T data) {
        this.data = data;
    }

    public Response(String error) {
        this.error = error;
    }

    public static <T> ResponseEntity<Response<T>> ok(T data) {
        return ResponseEntity.ok(new Response<>(data));
    }

    public static ResponseEntity<Response<Void>> badRequest(String error) {
        return ResponseEntity.badRequest().body(new Response<Void>(error));
    }

    public static ResponseEntity<Response<Void>> notFound(String error) {
        return new ResponseEntity<>(new Response<Void>(error), HttpStatus.NOT_FOUND);
    }

    public T getData() {
        return data;
    }

    public String getError() {
        return error;
    }
}
