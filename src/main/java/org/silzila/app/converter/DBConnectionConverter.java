package org.silzila.app.converter;

import org.silzila.app.dto.DBConnectionDTO;
import org.silzila.app.model.DBConnection;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class DBConnectionConverter {

    public DBConnectionDTO convertEntityToDto(DBConnection dbConnection) {
        ModelMapper modelMapper = new ModelMapper();
        DBConnectionDTO dbConnectionDTO = modelMapper.map(dbConnection, DBConnectionDTO.class);
        return dbConnectionDTO;
    }

    public DBConnection convertDtoToEntity(DBConnectionDTO dbConnectionDTO) {
        ModelMapper modelMapper = new ModelMapper();
        DBConnection dbConnection = modelMapper.map(dbConnectionDTO, DBConnection.class);
        return dbConnection;
    }

}
